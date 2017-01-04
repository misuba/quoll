"use strict";

const React = require('react');
const ReactDOM = require('react-dom');

const {Provider} = require('react-redux');

const bigReducerBundle = require('../src/reducers');


module.exports = React.createClass({
    displayName: 'App',

    propTypes: {
        store: React.PropTypes.object.isRequired,
        children: React.PropTypes.any.isRequired
    },

    render: function() {
        return <section className="outerFrame">
            <Provider store={this.props.store}>
                {this.props.children}
            </Provider>
        </section>;
    }
});
