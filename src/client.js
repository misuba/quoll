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
    const { Router, browserHistory } = require('react-router');

    const domReady = require('domready');

    // not proud of this, but we'll do it until a router is in place
    const Component = require('./components/' + initialData.component);

    domReady(() => ReactDOM.render(
        <Component {...initialData} />,
        document.getElementById('bullseye')
    ))

}
