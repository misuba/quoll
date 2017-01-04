"use strict";

const React = require('react');
const {connect} = require('react-redux');

const Router = require('Router');


const Link = React.createClass({

    propTypes: {
        endpoint: React.PropTypes.string.isRequired,
        values: React.PropTypes.object,

        cxOnNavigate: React.PropTypes.func.isRequired,
        currentRoute: React.PropTypes.object.isRequired,
    },

    getDefaultProps: function () {
        return { values: {} };
    },

    navigateWithClick: function(e) {
        e.preventDefault();

        const route = this.route(e);
        if (route
            && this.routeIsDifferentPage(route)
            && Router.routeIsSuitableTargetForClientNavigation(route)
            && this.eventIsPlainOldClick(e)
        )
            {
                e.preventDefault();
                this.props.cxOnNavigate(route);
                // where 'cx' precedes all handlers created and passed in by connect()ed elms
            }
    },

    eventIsPlainOldClick: function (e) {
        return e.button === 0 &&
        ! e.metaKey &&
        ! e.ctrlKey &&
        ! e.shiftKey &&
        ! e.altKey;
    },

    // We ignore links from any non-reacty sources that may be within
    eventSourceIsReact: function(e) {
        return e.target.getAttribute('data-reactid') !== null;
    },

    // We ignore links to the currently visible page
    // in order to allow the browser to handle fragments.
    routeIsDifferentPage: function (route) {
        let {currentRoute} = this.props;
        return route.endpoint != currentRoute.endpoint ||
            route.params != currentRoute.params;
    },

    onClick: function (e) {
        this.navigateWithClick(e);
    },

    route: function () {
        return Router.route(this.props.endpoint, this.props.values);
    },

    render: function () {
        return <a {...this.props} href={this.href()} onClick={this.onClick}>{this.props.children}</a>;
    },

    href: function () {
        return Router.urlForRoute(this.route());
    },
});

module.exports = connect(
    (state) => { return {currentRoute: state.currentRoute} },
    (dispatch) => { return {
        cxOnNavigate: (route) => {}
    }}
)(Link);
