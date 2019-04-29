import * as React from 'react';
import { connect } from 'react-redux';
import { createStore } from 'redux';
import 'font-awesome/css/font-awesome.min.css';
import 'react-wooden-tree/dist/react-wooden-tree.css';
import {
    ActionTypes, CommandQueueType, NodeProps, Tree, TreeDataType, TreeCallBackFunction, TreeState, callBack
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

/** Create the tree from hierarchical data */
const tree = Tree.convertHierarchicalTree(Tree.initHierarchicalTree(generator()));
/** The store */
export const store = createStore(combinedReducers, { treeData: tree});

class App extends React.Component<AppProps, AppState> {
    private uKey: number;

    /**
     * Constructor.
     * @param {{}} props
     */
    constructor(props: AppProps) {
        super(props);

        this.state = {
            commandHistory: [],
        };

        this.uKey = 0;
    }

    /**
     * On data change this function is called. In this example it is just
     * dispatches redux event (and for demo app purposes logs the dispatched event).
     *
     * @param command The commands which is requested by the tree.
     */
    onDataChange = (command: CommandQueueType[]) => {
        for ( let i = 0; i < command.length; i++ ) {
            this.props.callBack(command[i].nodeId, command[i].type, command[i].value);

            // Only to display the command history. Not needed for the tree.
            let newHistory = this.state.commandHistory;
            newHistory.push({...command[i], key: this.uKey++});
            this.setState({commandHistory: newHistory});
        }
    }

    /**
     * The lazy load callback returns a new promise. In this example
     * we return few children if it was requested for a specific node id.
     * Otherwise we return reject.
     *
     * @param node The node which is getting lazy loaded
     */
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

    /**
     * Helper function to do something with all the parent nodes.
     * Used for command buttons in the demo app.
     */
    actionToAllRoot = (type: string, value: any) => {
        let commands: CommandQueueType[] = [
            {nodeId: '0', type: type, value: value},
            {nodeId: '1', type: type, value: value},
            {nodeId: '2', type: type, value: value},
            {nodeId: '3', type: type, value: value}
        ];

        this.onDataChange(commands);
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
                    {/* The Tree */}
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
                    {/* End Of The Tree */}
                    {/* Control buttons  */}
                    <div>
                        <button
                            onClick={
                                () => this.actionToAllRoot(ActionTypes.EXPANDED, true)
                            }
                        >
                            Expand Parents
                        </button>
                        <button
                            onClick={
                                () => this.actionToAllRoot(ActionTypes.EXPANDED, false)
                            }
                        >
                            Collapse Parents
                        </button>
                        <br />
                        <button
                            onClick={
                                () => this.actionToAllRoot(ActionTypes.SELECTED, true)
                            }
                        >
                            Select All Parents (disregarding multi-select)
                        </button>
                        <button
                            onClick={
                                () => this.actionToAllRoot(ActionTypes.SELECTED, false)
                            }
                        >
                            Deselect All Parents (disregarding prevent deselect)
                        </button>
                        <br />
                        <button
                            onClick={
                                () => this.actionToAllRoot(ActionTypes.CHECKED, true)
                            }
                        >
                            Check all Parents (disregarding hierarchical check)
                        </button>
                        <button
                            onClick={
                                () => this.actionToAllRoot(ActionTypes.CHECKED, false)
                            }
                        >
                            Uncheck all Parents (disregarding hierarchical check)
                        </button>
                    </div>
                    {/* End Of Control Buttons */}
                </div>
                {/* Action Logger */}
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
                {/* End Of Action Logger */}
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
