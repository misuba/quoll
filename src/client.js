"use strict";

require('babel-polyfill');


if (initialData) {
    // Console shim
    if (!window.console) {
        let e = () => {};
        window.console = {
            log: e,
            warn: e,
            error: e
        };
    }

    const React = require('react');
    const ReactDOM = require('react-dom');
    const { createStore, applyMiddleware } = require('redux');
    const thunk = require('redux-thunk').default;

    const rootReducer = require('./reducers');
    const store = createStore(
        rootReducer,
        initialData,
        applyMiddleware(thunk)
    );

    const App = require('../components/App');

    const domReady = require('domready');

    domReady(() => ReactDOM.render(
        <App store={store} />,
        document.getElementById('bullseye')
    ))

}
