import * as React from 'react';
import { connect } from 'react-redux';
import { createStore } from 'redux';
import 'font-awesome/css/font-awesome.min.css';
import 'react-wooden-tree/dist/react-wooden-tree.css';
import {
    CommandQueueType, NodeProps, Tree, TreeDataType, TreeCallBackFunction, TreeState, callBack
} from 'react-wooden-tree';
import { generator, flat_lazy_children } from './Generator';
import { ReduxTree } from './redux/components/ReduxTree';
import { ConnectedNode } from './redux/components/ReduxNode';
import combinedReducers from './redux/reducers';

interface AppProps {
    TreeDataType?: TreeDataType;
    callBack: TreeCallBackFunction;
}

const tree = Tree.convertHierarchicalTree(Tree.initHierarchicalTree(generator()));
export const store = createStore(combinedReducers, { treeData: tree});

class App extends React.Component<AppProps, {}> {
    /**
     * Constructor.
     * @param {{}} props
     */
    constructor(props: AppProps) {
        super(props);
        this.lazyLoad = this.lazyLoad.bind(this);
    }

    onDataChange = (command: CommandQueueType[]) => {
        for ( let i = 0; i < command.length; i++ ) {
            this.props.callBack(command[i].nodeId, command[i].type, command[i].value);
        }
    }

    lazyLoad(node: NodeProps): Promise<TreeDataType> {
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
            <div className="App">
                <ReduxTree
                    hierarchicalCheck={true}
                    showCheckbox={true}
                    multiSelect={false}
                    preventDeselect={true}
                    allowReselect={true}
                    checkboxFirst={true}
                    connectedNode={ConnectedNode}
                    nodeIcon={'fa fa-fw fa-circle'}
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

const mapStateToProps = (state: TreeState) => ({
    TreeDataType: state.TreeDataType
});

const mapDispatchToProps = {
    callBack
};

export const ConnectedApp = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
