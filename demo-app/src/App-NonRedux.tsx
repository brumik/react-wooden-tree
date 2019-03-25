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
    state = {
        tree: Tree.initTree(generator())
    };

    /**
     * The callback function for changing data in the tree.
     *
     * @param {string} nodeId The nodeId of the node.
     * @param {string} type The field name which changed.
     * @param {boolean} value The new value to assign.
     */
    onDataChange = (nodeId: string, type: string, value: boolean) => {
        let node = Tree.nodeSelector(this.state.tree, nodeId);
        if ( node === null ) { return; }

        if (actionMapper.hasOwnProperty(type)) {
            node = actionMapper[type](node, value);
            console.log(node.nodeId, node.state.checked);
            this.setState({ tree: Tree.nodeUpdater(this.state.tree, node) });
        }
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
                    callbacks={{
                            onDataChange: this.onDataChange,
                    }}
                />
            </div>
        );
    }
}

export default AppNonRedux;
