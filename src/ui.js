"use strict";

const React = require('react');
const ReactDOM = require('react-dom');

// const passport = require('passport');

const routes = require('express').Router();

// routes.use((req, res, next) => {
//     console.log('hello from ui.js', req.originalUrl);
//     next();
// });

const db = require('./db');
routes.use((req, res, next) => {
    if (!db.users) {
        res.redirect('/setup');
    } else {
        next();
    }
});

let {serveAComponent} = require('./htmlServer');

let blockUnauthed = function(req, res, next) {
    if (!req.user) {
        // console.log('blockunauth neg', req.statusCode);
        res.redirect('/login');
    } else {
        // console.log('blockunauth pos', req.user);
        // console.log('noBlock!!!!', req.user);
        next();
    }
}


const FeedReader = require('../components/FeedReader');
const LoginPage = require('../components/LoginPage');

routes.get('/', /* attachComponent(BlogTop), serveAComponent); */ (req, res) => res.send('blog feed'));
routes.get('/feed', blockUnauthed, serveAComponent); // (req, res) => res.send('feed-reader'));
routes.get('/login', serveAComponent); //(req, res) => res.send('login page!!!'));
//routes.get('/logout', (req, res) => {destroy things in passport then redirect to / cool});
routes.get('/settings', /* blockUnauthed, attachComponent(Settings), serveAComponent); */ (req, res) => res.send('settings admin etc'));

routes.get('/api/*', (req, res, next) => next('route'));

routes.get('/:yearStr/:monStr/:dayStr/:slug', /* attachComponent(SinglePost), serveAComponent); */ (req, res) => {
    res.send('post with date stuff');
});
routes.get('/:slug', /* attachComponent(SinglePostOr404), serveAComponent); */ (req, res) => {
    res.send('post by slug, or else 404');
});


module.exports = routes;
