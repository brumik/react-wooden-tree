import * as React from 'react';
import { connect } from 'react-redux';
import { createStore } from 'redux';
import { combinedReducers, callBack, ReduxTree, generator,
    TreeCallBackFunction, TreeState, TreeData, Tree } from './internal';
import 'font-awesome/css/font-awesome.min.css';

interface AppProps {
    treeData?: TreeData;
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

    onDataChange = (nodeId: string, type: string, value: any) => this.props.callBack(nodeId, type, value);

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
    treeData: state.treeData
});

const mapDispatchToProps = {
    callBack
};

export const ConnectedApp = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
