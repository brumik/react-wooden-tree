import * as React from 'react';
import './App.css';
import { Tree } from './components/Tree';
import { generator } from './Generator';
import { NodeProps } from './components/Node';

interface AppState {
    tree: NodeProps[];
}

class App extends React.Component<{}, AppState> {
    private data: NodeProps[];

    constructor(props: {}) {
        super(props);

        this.data = generator();
        Tree.initTree(this.data);

        this.state = {
            tree: this.data,
        };
    }

    /**
     * The callback function for changing data in the tree.
     *
     * @param {string} id The id of the node.
     * @param {string} type The field name which changed.
     * @param {boolean} value The new value to asssing.
     */
    onDataChange = (id: string, type: string, value: boolean): void => {
        let node = Tree.nodeSelector(this.data, id);
        if ( node == null ) { return; }

        if ( type === 'state.expanded' ) {
            node.state.expanded = value;
        } else if ( type === 'state.checked' ) {
            node.state.checked = value;
        } else if ( type === 'state.selected') {
            node.state.selected = value;
        } else {
            console.log(id, type, value);
        }

        this.setState({tree: this.data});
    }

    render() {
        return (
          <div className="App">
            <Tree
                hierarchicalCheck={true}
                showCheckbox={true}
                multiSelect={true}
                checkboxFirst={true}
                nodeIcon={'fa fa-fw'}
                partiallyCheckedIcon={'fa fa-ban'}
                data={this.state.tree}
                onDataChange={this.onDataChange}
            />
          </div>
        );
    }
}

export default App;
