import * as React from 'react';
import './App.css';
import { Tree } from './components/Tree';
import { generator } from './Generator';

class App extends React.Component {
  tree: Tree = null;

  onDataChange = (id: string, type: string, value: boolean): void => {
      console.log(id, type, value);
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
            onDataChange={this.onDataChange}
        />
      </div>
    );
  }
}

export default App;
