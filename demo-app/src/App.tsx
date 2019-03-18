// import * as React from 'react';
// import 'font-awesome/css/font-awesome.min.css';
// import './App.css';
// import { Tree } from './components/Tree';
// import { generator } from './Generator-Bigger';
// import { NodeProps, TreeData } from './components/Node';
// import { callBack, store } from './redux';
// // @ts-ignore
// import { connect, Provider } from 'react-redux';
//
// interface AppState {
//     tree: TreeData;
// }
//
// class App extends React.Component<{}, AppState> {
//     private data: TreeData;
//
//     private actionMapper = {
//         'state.expanded': Tree.nodeExpanded,
//         // 'state.checked': Tree.nodeChecked,
//         // 'state.disabled': Tree.nodeDisabled,
//         // 'state.selected': Tree.nodeSelected,
//         // 'nodes': Tree.nodeChildren,
//         // 'loading': Tree.nodeLoading,
//     };
//
//     /**
//      * Constructor.
//      * @param {{}} props
//      */
//     constructor(props: {}) {
//         super(props);
//
//         this.data = Tree.initTree(generator());
//
//         // console.log(Tree.nodeSearch(this.data, null, 'data-random', 'random'));
//
//         this.state = {
//             tree: this.data,
//         };
//
//         this.onDataChange = this.onDataChange.bind(this);
//         this.lazyLoad = this.lazyLoad.bind(this);
//     }
//
//     /**
//      * The callback function for changing data in the tree.
//      *
//      * @param {string} nodeId The nodeId of the node.
//      * @param {string} type The field name which changed.
//      * @param {boolean} value The new value to assign.
//      */
//     onDataChange(nodeId: string, type: string, value: boolean): void {
//         let node = Tree.nodeSelector(this.data, nodeId);
//         if ( node == null ) { return; }
//
//         if (this.actionMapper.hasOwnProperty(type)) {
//             node = this.actionMapper[type](node, value);
//             this.data = Tree.nodeUpdater(this.data, node);
//
//             this.setState({tree: this.data});
//         }
//     }
//
//     /**
//      * The lazy loading function - Dummy
//      *
//      * @param {NodeProps} node The node to get children.
//      * @returns {NodeProps[]} The children.
//      */
//     lazyLoad(node: NodeProps): Promise<TreeData> {
//         let isWorking = true;
//
//         return new Promise((resolve, reject) => {
//             setTimeout(() => {
//                 if ( isWorking ) {
//                     resolve(generator());
//                 } else {
//                     reject(new Error('Something happened.'));
//                 }
//             }, 2000);
//         });
//     }
//
//     render() {
//         return (
//             <Provider store={store}>
//                 <div className="App">
//                     <Tree
//                         hierarchicalCheck={true}
//                         showCheckbox={true}
//                         multiSelect={false}
//                         preventDeselect={true}
//                         allowReselect={true}
//                         checkboxFirst={true}
//                         nodeIcon={'fa fa-fw fa-circle'}
//                         // partiallyCheckedIcon={'fa fa-ban'}
//                         data={this.state.tree}
//                         onDataChange={this.onDataChange}
//                         lazyLoad={this.lazyLoad}
//                     />
//                 </div>
//             </Provider>
//         );
//     }
// }
//
// // @ts-ignore
// const mapStateToProps = state => ({
//     tree: state.tree
// });
//
// const mapDispatchToProps = {
//     callBack
// };
//
// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(App);

import * as React from 'react';
import { connect } from 'react-redux';
import { generator } from './Generator-Bigger';
import { Tree } from './components/Tree';
import { TreeData } from './components/Node';
import { createStore } from 'redux';
import combinedReducers from './redux/reducers';
import callBack from './redux/actions/tree';
import { TreeCallBackFunction, TreeState } from './redux/types';
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
                    data={this.props.treeData}
                    onDataChange={(nodeId, type, value) =>
                        this.props.callBack(nodeId, type, value)
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
