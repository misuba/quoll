const config = require('../config.json');

const crypto = require('crypto');

const passport = require('passport');


const encodePassword = function(password, time) {
    let hmac = crypto.createHmac('sha256', config.PW_SECRET || config.SESSION_SECRET);
    hmac.update(password + time.toString());
    return hmac.digest('hex');
};

const validPassword = function(possiblePassword, user) {
    let hmac = crypto.createHmac('sha256', config.PW_SECRET || config.SESSION_SECRET);
    hmac.update(possiblePassword + user.createdAt.toString());
    return hmac.digest('hex') === user.passwordHash;
};

const authAndHandleUser = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            console.log('authHandler says no user', user);
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/feed');
        });
    })(req, res, next);
};

module.exports = {encodePassword, validPassword, authAndHandleUser};
