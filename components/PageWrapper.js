const React = require('react');
const ReactDOM = require('react-dom');

const {connect} = require('react-redux');


const PageWrapper = function(props) {
    return <div className="top container">
        {props.flash && props.flash.error && <div className="alert alert-warning">flasherr:{props.flash.error.toString()}</div>}
        {(props.errorMessages.length>0) && <div className="alert alert-danger">errorMsgs:{props.errorMessages.toString()}</div>}
        <header className="row">
            {props.user && Object.keys(props.user).length
                ? <nav className="user col">
                    {props.user.username}&nbsp;
                    <span className="logout">(<a href="/logout">Logout</a>)</span>
                    <hr />
                </nav>
                : null /* <HCard /> */
            }
            {props.flash && <aside className="error">{props.flash.error}</aside>}
        </header>
        <section className="row">
          {props.nav && <nav className="col-md-3">{props.nav}</nav>}
          {props.children}
        </section>
        <footer className="row">
            FOOTER
        </footer>
    </div>;
};

module.exports = connect(
    (state) => {return {
        user: state.user,
        flash: state.flash,
        errorMessages: state.errorMessages
    }},
    (dispatch) => {return {
        // who knows what for logins
    }}
)(PageWrapper);
