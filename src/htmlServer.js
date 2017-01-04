"use strict";

const fs = require('fs');

const React = require('react');
const ReactDOM = require('react-dom/server');
const { createStore, applyMiddleware } = require('redux');
const thunk = require('redux-thunk').default;

const componentMap = require('./componentMap');
const rootReducer = require('./reducers');
const { doInitialActions, addFlashAndComponentName } = require('./actions');

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
    console.log('serveAsPage');
    return replace(page.toString(), {
        TITLE: title || 'Quoll',
        BODY: markup,
        INITIAL_DATA: escapeScriptTagData(
            JSON.stringify(data)
        )
    });
};

let serveAComponent = function(req, res) {
    if (!req.Component) {
        req.Component = componentMap(req.originalUrl);
        if (!req.Component) {
            res.status(404).end();
        }
    }

    const store = createStore(
        rootReducer,
        applyMiddleware(thunk)
    );
    let flash = {error: req.flash('error'), tutorial: req.flash('tutorial')};

    let initialActions = req.Component.initialActions && req.Component.initialActions(req.params, req.user);
    /*
    that has to be like
    [(dispatch) => promise, (dispatch) => promise, ...]
     */

    if (initialActions) {
        store.dispatch(
            doInitialActions(initialActions, {cookie: req.headers.cookie})
        ).then(function() {
            store.dispatch(addFlashAndComponentName(flash, req.Component.displayName));
            console.log('then clause after doInitialActions has been called');
            try {
                res.end(serveAsPage(ReactDOM.renderToString(
                    React.createElement(App, {store}, React.createElement(req.Component))
                ), store.getState()));
            } catch(err) {
                // throw new Error(err);
                res.status(500).end(err.toString());
            }
        }).catch((err) => {
            // console.log('caught error');
            // res.end(serveAsPage(ReactDOM.renderToString(
            //     React.createElement(App, {store}, React.createElement(req.Component))
            // ), store.getState()))
            throw new Error(err);
        });
    } else {
        store.dispatch(addFlashAndComponentName(flash, req.Component.displayName));
        res.end(serveAsPage(ReactDOM.renderToString(
            React.createElement(App, {store}, React.createElement(req.Component))
        ), store.getState()));
    }
};

module.exports = {attachComponent, serveAComponent};
