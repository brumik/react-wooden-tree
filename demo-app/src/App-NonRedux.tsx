import * as React from 'react';
import { Tree, generator, NodeProps, TreeData, ActionTypes } from './internal';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';

interface AppState {
    tree: TreeData;
}

const actionMapper: {[key: string]: (node: NodeProps, value: any) => NodeProps} = {
    [ActionTypes.EXPANDED]: Tree.nodeExpanded,
    [ActionTypes.CHECKED]: Tree.nodeChecked,
    [ActionTypes.DISABLED]: Tree.nodeDisabled,
    [ActionTypes.SELECTED]: Tree.nodeSelected,
    [ActionTypes.CHILD_NODES]: Tree.nodeChildren,
    [ActionTypes.LOADING]: Tree.nodeLoading,
};

export class AppNonRedux extends React.Component<{}, AppState> {
    private data: TreeData;

    /**
     * Constructor.
     * @param {{}} props
     */
    constructor(props: {}) {
        super(props);

        this.data = Tree.initTree(generator());

        this.state = {
            tree: this.data,
        };

        this.onDataChange = this.onDataChange.bind(this);
        this.lazyLoad = this.lazyLoad.bind(this);
    }

    /**
     * The callback function for changing data in the tree.
     *
     * @param {string} nodeId The nodeId of the node.
     * @param {string} type The field name which changed.
     * @param {boolean} value The new value to assign.
     */
    onDataChange(nodeId: string, type: string, value: boolean): void {
        let node = Tree.nodeSelector(this.data, nodeId);
        if ( node == null ) { return; }

        if (actionMapper.hasOwnProperty(type)) {
            node = actionMapper[type](node, value);
            this.data = Tree.nodeUpdater(this.data, node);

            this.setState({tree: this.data});
        }
    }

    /**
     * The lazy loading function - Dummy
     *
     * @param {NodeProps} node The node to get children.
     * @returns {NodeProps[]} The children.
     */
    lazyLoad(node: NodeProps): Promise<TreeData> {
        let isWorking = true;

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if ( isWorking ) {
                    resolve(generator());
                } else {
                    reject(new Error('Something happened.'));
                }
            }, 2000);
        });
    }

    render() {
        return (
            <div className="App">
                <Tree
                    hierarchicalCheck={true}
                    showCheckbox={true}
                    multiSelect={false}
                    preventDeselect={true}
                    allowReselect={true}
                    checkboxFirst={true}
                    nodeIcon={'fa fa-fw fa-circle'}
                    data={this.state.tree}
                    callbacks={
                        {
                            onDataChange: this.onDataChange,
                            lazyLoad: this.lazyLoad
                        }
                    }
                />
            </div>
        );
    }
}

export default AppNonRedux;
