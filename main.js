"use strict";

require('node-jsx').install();

const http = require('http');

global.__server = true;
global.__DEV__ = process.env.NODE_ENV !== 'production';

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const methodOverride = require('method-override');
const flash = require('connect-flash-plus');
// const morgan = require('morgan');

const config = require('./config.json');

const passport = require('./src/passport');
const { authAndHandleUser } = require('./src/user');

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser());
app.use(methodOverride());
app.use(flash());
app.use(session({ secret: config.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());

// development only
if (__DEV__) {
    app.use(errorHandler());
}


const setupRoutes = require('./src/setup');
app.use('/setup', setupRoutes);


app.post('/login', authAndHandleUser);


const apiRoutes = require('./src/api');
app.use('/api', apiRoutes);


const frontRoutes = require('./src/ui');
app.use('/', frontRoutes);


// then:

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
