import * as React from 'react';
import { connect } from 'react-redux';
import { createStore } from 'redux';
import {
    combinedReducers, callBack, ReduxTree, generator,
    TreeCallBackFunction, TreeState, TreeDataType, Tree, CommandQueueType,
    ConnectedNode
} from './internal';
import 'font-awesome/css/font-awesome.min.css';

interface AppProps {
    TreeDataType?: TreeDataType;
    callBack: TreeCallBackFunction;
}

export const store = createStore(combinedReducers, { treeData: Tree.initTree(generator())});

class App extends React.Component<AppProps, {}> {
    /**
     * Constructor.
     * @param {{}} props
     */
    constructor(props: AppProps) {
        super(props);
    }

    onDataChange = (command: CommandQueueType[]) => {
        for ( let i = 0; i < command.length; i++ ) {
            this.props.callBack(command[i].nodeId, command[i].type, command[i].value);
        }
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
                            onDataChange: this.onDataChange
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
