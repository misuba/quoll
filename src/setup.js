"use strict";

const React = require('react');
const ReactDOM = require('react-dom');

const {encodePassword} = require('./user');
const db = require('./db');

const routes = require('express').Router();

routes.use((req, res, next) => {
    console.log('hello from ui.js', req.originalUrl);
    next();
});

let {serveAComponent} = require('./htmlServer');


const SetupOne = require('../components/SetupOne');

routes.get('/', serveAComponent);

routes.post('/', (req, res) => {
    if (req.body && req.body.username && req.body.password1 && req.body.password2
            && req.body.password1 == req.body.password2) {
        let timestamp = new Date().getTime();
        db.saveDoc("users", {
            username: req.body.username,
            passwordHash: encodePassword(req.body.password1, timestamp),
            createdAt: timestamp
        }, function(err, doc) {
            if (err) {
                req.flash('error', err);
                res.redirect('/setup');
            } else {
                req.flash('tutorial', 'yes');
                res.redirect('/feed');
            }
        });
    } else {
        res.status(400).end();
    }
})

module.exports = routes;
