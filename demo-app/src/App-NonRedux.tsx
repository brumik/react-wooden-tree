import * as React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import 'react-wooden-tree/dist/react-wooden-tree.css';
import { CommandQueueType, ActionTypes, NodeProps, Tree, TreeDataType } from 'react-wooden-tree';
import { flat_lazy_children, generator } from './Generator';

interface AppState {
    tree: TreeDataType;
    commandHistory: (CommandQueueType & {key: Number})[];
}

const actionMapper: {[key: string]: (node: NodeProps, value: any) => NodeProps} = {
    [ActionTypes.EXPANDED]: Tree.nodeExpanded,
    [ActionTypes.CHECKED]: Tree.nodeChecked,
    [ActionTypes.DISABLED]: Tree.nodeDisabled,
    [ActionTypes.SELECTED]: Tree.nodeSelected,
    [ActionTypes.CHILD_NODES]: Tree.nodeChildren,
    [ActionTypes.LOADING]: Tree.nodeLoading
};

export class AppNonRedux extends React.Component<{}, AppState> {
    state = {
        tree: Tree.convertHierarchicalTree(Tree.initHierarchicalTree(generator())),
        commandHistory: [] as (CommandQueueType & {key: Number})[],
    };

    // This is needed. At too fast changes (multiple changes before the state changes)
    // we may lose some data, as we update the same node multiple times, but the second one
    // overrides the first change. Happening with lazy load loading icon.
    private tree = Tree.convertHierarchicalTree(Tree.initHierarchicalTree(generator()));
    private uKey: number = 0;

    /**
     * The callback function for changing data in the tree.
     *
     * @param {[string, string, any]} commands The array of node changing commands.
     */
    onDataChange = (commands: CommandQueueType[]) => {
        for ( let i = 0; i < commands.length; i++ ) {
            let command = commands[i];
            let node = Tree.nodeSelector(this.tree, command.nodeId);
            if (node === null) {
                continue;
            }

            if (actionMapper.hasOwnProperty(command.type)) {
                node = actionMapper[command.type](node, command.value);
                this.tree = Tree.nodeUpdater(this.tree, node);
            } else if ( command.type === ActionTypes.ADD_NODES ) {
                this.tree = Tree.addNodes(this.tree, command.value);
            }

            // Only to display the command history. Not needed for the tree.
            let newHistory = this.state.commandHistory;
            newHistory.push({...command, key: this.uKey++});
            this.setState({commandHistory: newHistory});
        }
        this.setState({tree: this.tree});
    }

    lazyLoad = (node: NodeProps): Promise<TreeDataType> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if ( node.nodeId === '0.3') {
                    resolve(flat_lazy_children(node.nodeId));
                } else {
                    reject(new Error('Something happened.'));
                }
            }, 2000);
        });
    }

    render() {
        return (
            <div
                className="App"
                style={{
                    display: 'flex'
                }}
            >
                <div
                    style={{
                        flex: '50%'
                    }}
                >
                    <Tree
                        hierarchicalCheck={true}
                        showCheckbox={true}
                        multiSelect={false}
                        preventDeselect={true}
                        allowReselect={true}
                        checkboxFirst={true}
                        nodeIcon={'fa fa-fw fa-circle'}
                        data={this.state.tree}
                        callbacks={{
                            onDataChange: this.onDataChange,
                            lazyLoad: this.lazyLoad
                        }}
                    />
                </div>
                <table
                    style={{
                        flex: '50%'
                    }}
                >
                    <thead>
                    <tr>
                        <th colSpan={3}><h3>Action History</h3></th>
                    </tr>
                    <tr>
                        <th>NodeId</th>
                        <th>Action Type</th>
                        <th>Passed Value</th>
                    </tr>
                    </thead>
                    <tbody style={{textAlign: 'center'}}>
                    {this.state.commandHistory.map(element =>
                        <tr key={element.key.toString()}>
                            <td>{element.nodeId}</td>
                            <td>{element.type}</td>
                            <td>{JSON.stringify(element.value)}</td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default AppNonRedux;
