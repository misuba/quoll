"use strict";

const fs = require('fs');

const React = require('react');
const ReactDOM = require('react-dom/server');
const { createStore, applyMiddleware } = require('redux');
const thunk = require('redux-thunk').default;

const Router = require('./router');
const rootReducer = require('./reducers');
const actions = require('./actions');

const App = require('../components/App');


function attachComponent(Which) {
    return function(req, res, next) {
        req.Component = Which;
        next();
    }
}

function escapeScriptTagData(str) {
    return replace(str, {
        '&': '\\u0026',
        '<': '\\u003c',
        '>': '\\u003e',
        '\u2028': '\\u2028',
        '\u2029': '\\u2029'
    });
}

function replace(str, replacements) {
    return Object.keys(replacements).reduce(function(str, marker) {
        // you have to do it this way in javascript unless you
        // want to trust that you don't have any regex special
        // characters in your markers
        return str.split(marker).join(replacements[marker]);
    }, str);
}

let page = fs.readFileSync(__dirname + '/../basic.html');
let serveAsPage = function(markup, data, title) {
    return replace(page.toString(), {
        TITLE: title || 'Quoll',
        BODY: markup,
        INITIAL_DATA: escapeScriptTagData(
            JSON.stringify(data)
        )
    });
};

let serveAComponent = function(req, res) {
    let route = Router.route(req.originalUrl);
    if (!req.Component) {
        req.Component = Router.componentTypeForRoute(route);
        if (!req.Component) {
            res.status(404).end();
        }
    }

    const store = createStore(
        rootReducer,
        {currentRoute: route},
        applyMiddleware(thunk)
    );
    let flash = {error: req.flash('error'), tutorial: req.flash('tutorial')};

    let initialActions = req.Component.initialActions && req.Component.initialActions(req.params, req.user);
    /*
    that has to be like
    [(dispatch) => promise, (dispatch) => promise, ...]
     */

    store.dispatch(actions.addFlashAndComponentName(flash, req.Component.displayName));
    store.dispatch(actions.addUserInfo(req.user || {}));
    if (initialActions) {
        store.dispatch(
            actions.doInitialActions(initialActions, {cookie: req.headers.cookie})
        ).then(function() {
            try {
                res.end(serveAsPage(ReactDOM.renderToString(
                    React.createElement(App, {store})
                ), store.getState()));
            } catch(err) {
                res.status(500).end(err.toString());
            }
        }).catch((err) => {
            // res.end(serveAsPage(ReactDOM.renderToString(
            //     React.createElement(App, {store}, React.createElement(req.Component))
            // ), store.getState()))
            throw new Error(err);
        });
    } else {
        res.end(serveAsPage(ReactDOM.renderToString(
            React.createElement(App, {store})
        ), store.getState()));
    }
};

module.exports = {attachComponent, serveAComponent};
