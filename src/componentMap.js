"use strict";

//const BlogTop = require('../components/BlogTop');
const LoginPage = require('../components/LoginPage');
const FeedReader = require('../components/FeedReader');
//const Admin = require('../components/Admin');
//const {BlogPostOr404} = require('../components/SinglePost');


const mappy = {
    //'/': BlogTop,
    '/login': LoginPage,
    '/feed': FeedReader
    //'/settings': Admin,
    //'/new': EditPost
};

module.exports = function componentMap(route) {
    return mappy[route]; // || BlogPostOr404;
}
