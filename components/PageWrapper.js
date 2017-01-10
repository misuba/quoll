const React = require('react');
const ReactDOM = require('react-dom');

const {connect} = require('react-redux');


const PageWrapper = function(props) {
    return <div className="top">
        <header>
            {props.user && Object.keys(props.user).length
                ? <nav className="user">
                    {props.user.username}&nbsp;
                    <span className="logout">(<a href="/logout">Logout</a>)</span>
                    <hr />
                </nav>
                : null /* <HCard /> */
            }
            {props.flash && <aside className="error">{props.flash.error}</aside>}
        </header>
        {props.nav && <nav>{props.nav}</nav>}
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
