"use strict";

const React = require('react');
const ReactDOM = require('react-dom');

const {connect} = require('react-redux');


const PageWrapper = function(props) {
    return <div className="top">
        <header>
            {props.user
                ? <nav>
                    {props.user.username}
                    <span className="logout">(<a href="/logout">Logout</a>)</span>
                    <hr />
                    {props.nav || null}
                </nav>
                : null /* <HCard /> */
            }
            {props.flash && <aside className="error">{props.flash.error}</aside>}
        </header>
        {props.children}
        <footer>
            FOOTER
        </footer>
    </div>;
};

module.exports = connect(
    (state) => {return {
        user: state.user,
        flash: state.flash
    }},
    (dispatch) => {return {
        // who knows what for logins
    }}
)(PageWrapper);