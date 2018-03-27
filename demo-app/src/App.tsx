import * as React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';
import { Tree } from './components/Tree';
import { generator } from './Generator';
import { NodeProps } from './components/Node';

interface AppState {
    tree: NodeProps[];
}

class App extends React.Component<{}, AppState> {
    private data: NodeProps[];

    private actionMapper = {
        'state.expanded': Tree.nodeExpanded,
        'state.checked': Tree.nodeChecked,
        'state.disabled': Tree.nodeDisabled,
        'state.selected': Tree.nodeSelected,
        'nodes': Tree.nodeChildren,
        'loading': Tree.nodeLoading,
    };

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
     * @param {string} id The id of the node.
     * @param {string} type The field name which changed.
     * @param {boolean} value The new value to assign.
     */
    onDataChange(id: string, type: string, value: boolean): void {
        let node = Tree.nodeSelector(this.data, id);
        if ( node == null ) { return; }

        if (this.actionMapper.hasOwnProperty(type)) {
            node = this.actionMapper[type](node, value);
            this.data = Tree.nodeUpdater(this.data, node);
        } else {
            // console.log(id, type, value);
        }

        this.setState({tree: this.data});
    }

    /**
     * The lazy loading function - Dummy
     *
     * @param {NodeProps} node The node to get children.
     * @returns {NodeProps[]} The children.
     */
    lazyLoad(node: NodeProps): Promise<NodeProps[]> {
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
                // partiallyCheckedIcon={'fa fa-ban'}
                data={this.state.tree}
                onDataChange={this.onDataChange}
                lazyLoad={this.lazyLoad}
            />
          </div>
        );
    }
}

export default App;
