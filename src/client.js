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

    if (window.history.replaceState) {
        window.history.replaceState(
            store.getState().currentRoute,
            '',
            document.location
        );
    }

    window.addEventListener("popstate", (event) => {
        // event.state will be undefined when some browsers fire this event
        // on the initial page load:
        if (event.state) {
            store.dispatch(actions.routeWithoutLoad(event.state));
        }
    });

    const App = require('../components/App');

    const domReady = require('domready');

    domReady(() => ReactDOM.render(
        React.createElement(App, {store}),
        document.querySelector('section.outerFrame')
    ));

}
