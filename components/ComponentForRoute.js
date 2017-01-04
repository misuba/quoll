"use strict";

const React = require('react');
const ReactDOM = require('react-dom');

const {connect} = require('react-redux');

const Router = require('../src/router');


const ComponentForRoute = function(props) {
    let Component = Router.componentTypeForRoute(props.route);
    return props.loading
        ? <div className="spinner">spinner</div>
        : <div><Component /></div>;
};

module.exports = connect(
    (state) => {return {
        loading: state.loadingRoute,
        route: state.currentRoute
    }}
)(ComponentForRoute);
