import * as React from 'react';
import './App.css';
import { Tree } from './components/Tree';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Tree
            checkable={false}
            tree={{
                text: 'Root',
                    nodes: [
                        {text: 'First node'},
                        {text: 'Parent node', state: {expanded: true}, checkable: true,
                            nodes: [
                                {text: 'Child node 1', state: {expanded: false, checked: true}},
                                {text: 'Child node 2', state: {checked: true},
                                    nodes: [
                                        {text: 'Child node 2.1'},
                                        {text: 'Child node 2.2'}
                                    ]
                                }
                            ]
                        }
                    ]
                }}
        />
      </div>
    );
  }
}

export default App;
