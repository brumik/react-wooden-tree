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

interface AppState {
    commandHistory: (CommandQueueType & {key: Number})[];
}

const tree = Tree.convertHierarchicalTree(Tree.initHierarchicalTree(generator()));
export const store = createStore(combinedReducers, { treeData: tree});

class App extends React.Component<AppProps, AppState> {
    private uKey: number;

    /**
     * Constructor.
     * @param {{}} props
     */
    constructor(props: AppProps) {
        super(props);
        this.lazyLoad = this.lazyLoad.bind(this);

        this.state = {
            commandHistory: [],
        };

        this.uKey = 0;
    }

    onDataChange = (command: CommandQueueType[]) => {
        for ( let i = 0; i < command.length; i++ ) {
            this.props.callBack(command[i].nodeId, command[i].type, command[i].value);

            // Only to display the command history. Not needed for the tree.
            let newHistory = this.state.commandHistory;
            newHistory.push({...command[i], key: this.uKey++});
            this.setState({commandHistory: newHistory});
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
