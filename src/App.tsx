import * as React from 'react';
import './App.css';
import { Tree } from './components/Tree';
import { generator } from './Generator';

class App extends React.Component {
  tree: Tree = null;

  componentDidMount() {
      console.log(this.tree.getSiblings(['0.1']));
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
