const config = require('../config.json');

const crypto = require('crypto');


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

module.exports = {encodePassword, validPassword};
