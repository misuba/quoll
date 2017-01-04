"use strict";

const React = require('react');
const ReactDOM = require('react-dom');

module.exports = function(props) {
    return <section>
        <div>So this is your first time starting up this Quoll instance. Hooray! All we need to get you started is a username and password.</div>
        <form method="post" action="/setup">
            <p>
                <label htmlFor="username">Username</label><br />
                <input type="text" name="username" value="" />
            </p>
            <p>
                <label htmlFor="password1">Password</label><br />
                <input type="password" name="password1" value="" />
            </p>
            <p>
                <label htmlFor="password2">Confirm Password</label><br />
                <input type="password" name="password2" value="" />
            </p>
            <input type="submit" value="Go" />
        </form>
    </section>;
};
