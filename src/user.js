const passport = require('./passport');


const authAndHandleUserForAPI = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (req.user) {
            return next();
        }
        if (err) {
            return next(err);
        }
        if (!user) {
            console.log('authHandlerForAPI says no user', user);
            return res.status(403).json({error: 'Please log in to use this API endpoint.'});
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            return next();
        });
    })(req, res, next);
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

module.exports = {authAndHandleUser, authAndHandleUserForAPI};
