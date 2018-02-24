import * as React from 'react';
import './App.css';
import { Tree } from './components/Tree';
import { generator } from './Generator';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Tree
            hierarchicalCheck={true}
            showCheckbox={true}
            data={generator()}
        />
      </div>
    );
  }
}

export default App;
