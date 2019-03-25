// Redux Caller
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { ConnectedApp as App, store } from './App';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

// // Non Redux Caller
// import * as React from 'react';
// import * as ReactDOM from 'react-dom';
// import App from './App-NonRedux';
// import registerServiceWorker from './registerServiceWorker';
//
// ReactDOM.render(
//     <App />,
//     document.getElementById('root') as HTMLElement
// );
// registerServiceWorker();
