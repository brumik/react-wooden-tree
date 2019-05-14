import * as React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { CommandQueueType, ActionTypes, NodeProps, Tree, TreeDataType } from 'react-wooden-tree';
import { flat_lazy_children, generator } from './Generator';

interface AppState {
    tree: TreeDataType;
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
    };

    /**
     * The callback function for changing data in the tree.
     *
     * @param {[string, string, any]} commands The array of node changing commands.
     */
    onDataChange = (commands: CommandQueueType[]) => {
        let tree: TreeDataType = {...this.state.tree};
        for ( let i = 0; i < commands.length; i++ ) {
            let command = commands[i];
            let node = Tree.nodeSelector(tree, command.nodeId);
            if (node === null) {
                continue;
            }

            if (actionMapper.hasOwnProperty(command.type)) {
                node = actionMapper[command.type](node, command.value);
                tree = Tree.nodeUpdater(tree, node);
            } else if ( command.type === ActionTypes.ADD_NODES ) {
                tree = Tree.addNodes(tree, command.value);
            }
        }
        this.setState({tree: tree});
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
            <div>
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
        );
    }
}

export default AppNonRedux;
