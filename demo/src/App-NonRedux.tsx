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
    // This is needed. At too fast changes (multiple changes before the state changes)
    // we may lose some data, as we update the same node multiple times, but the second one
    // overrides the first change. Happening with lazy load loading icon.
    private tree: TreeDataType;

    /**
     * Constructor.
     * @param {{}} props
     */
    constructor(props: {}) {
        super(props);

        this.tree = Tree.convertHierarchicalTree(Tree.initHierarchicalTree(generator()));
        this.state = {
            tree: this.tree,
        };
    }

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
