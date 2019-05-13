// Common import statements
import * as React from 'react';
import * as ReactDOM from 'react-dom';
// Redux App import statements
import { Provider } from 'react-redux';
import { ConnectedApp as App, store } from './App';
// Non Redux App import statement
import AppNonRedux from './App-NonRedux';

ReactDOM.render(
    <div>
        <h2>With Redux</h2>
        <Provider store={store}>
            <App />
        </Provider>
        <hr />
        <h2>Without Redux</h2>
        <AppNonRedux />
    </div>,
document.getElementById('root') as HTMLElement
);
