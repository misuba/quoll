const db = require('./db');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const {validPassword} = require('./user');

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    db.users.findDoc({id}, (err, user) => {
        return done(err, user);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        if (!db.users) {
            console.log('setup users pls');
            done(null, false, { message: 'Setup users' });
        }
        else {
            db.users.findDoc({username}, (err, user) => {
                if (user && Array.isArray(user)) {
                    user = user[0];
                }
                if (err) {
                    done(err);
                }
                else if (!user) {
                    done(null, false, { message: 'Incorrect username.' });
                }
                else if (!validPassword(password, user)) {
                    done(null, false, { message: 'Incorrect password.' });
                }
                else {
                    console.log('user', user);
                    done(null, user);
                }
            });
        }
    }
));

module.exports = passport;
