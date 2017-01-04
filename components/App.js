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

    componentDidMount: () => { // it's possible this should go in client.js?
        if (window.history.replaceState) {
            window.history.replaceState(
                this.props.store.getState().currentRoute,
                '',
                document.location
            );
        }

        window.addEventListener("popstate", (event) => {
            // event.state will be undefined when some browsers fire this event
            // on the initial page load:
            if (event.state) {
                this.props.store.dispatch(actions.routeWithoutLoad(event.state));
            }
        });
    },

    render: function() {
        return <section className="outerFrame">
            <Provider store={this.props.store}>
                <ComponentForRoute />
            </Provider>
        </section>;
    }
});
