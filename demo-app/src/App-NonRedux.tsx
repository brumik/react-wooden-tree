import * as React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import { ActionTypes, NodeProps, Tree, TreeDataType } from 'react-wooden-tree';
import './App.css';
import { generator } from './Generator';

interface AppState {
    tree: TreeDataType;
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
        tree: Tree.convertHierarchicalTree(Tree.initHierarchicalTree(generator()))
    };

    /**
     * The callback function for changing data in the tree.
     *
     * @param {[string, string, any]} commands The array of node changing commands.
     */
    onDataChange = (commands: [string, string, any]) => {
        let temp = {...this.state.tree};
        for ( let i = 0; i < commands.length; i++ ) {
            let command = commands[i];
            let node = Tree.nodeSelector(temp, command.nodeId);
            if (node === null) {
                continue;
            }

            if (actionMapper.hasOwnProperty(command.type)) {
                node = actionMapper[command.type](node, command.value);
                temp = Tree.nodeUpdater(temp, node);
            }
        }
        this.setState({tree: temp});
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
