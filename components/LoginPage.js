const React = require('react');
const {connect} = require('react-redux');

const PageWrapper = require('./PageWrapper');


const LoginPage = (props) => {
    return (
        <PageWrapper>
            <form method="post">
                <p>Username: <input type="text" name="username" /></p>
                <p>Password: <input type="password" name="password" /></p>
                <p><input type="submit" value="Log In" /></p>
            </form>
        </PageWrapper>
    )
}

module.exports = LoginPage;
