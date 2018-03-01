import * as React from 'react';
import './App.css';
import { Tree } from './components/Tree';
import { generator } from './Generator-Bigger';

class App extends React.Component {
  tree: Tree = null;

  componentDidMount() {
      this.tree.collapseNode(['0.0', '0.vgd', '0.1']);
  }

  render() {
    return (
      <div className="App">
        <Tree
            hierarchicalCheck={true}
            showCheckbox={true}
            nodeIcon={'fa fa-fw'}
            partiallyCheckedIcon={'fa fa-ban'}
            data={generator()}
            ref={(ref) => { this.tree = ref; }}
        />
      </div>
    );
  }
}

export default App;
