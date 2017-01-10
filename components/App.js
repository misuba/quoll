"use strict";

const React = require('react');
const ReactDOM = require('react-dom');

const {Provider} = require('react-redux');

const bigReducerBundle = require('../src/reducers');
const actions = require('../src/actions');

const ComponentForRoute = require('./ComponentForRoute');


module.exports = React.createClass({
    displayName: 'App',

    propTypes: {
        store: React.PropTypes.object.isRequired
    },

    render: function() {
        return <section className="outerFrame">
            <Provider store={this.props.store}>
                <ComponentForRoute />
            </Provider>
        </section>;
    }
});
