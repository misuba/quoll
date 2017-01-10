// swiped from underscore :-(
const memoize = function(func, hasher) {
    let memo = {};
    hasher || (hasher = (val) => val);
    return function() {
        let key = hasher.apply(this, arguments);
        return (Object.keys(memo).indexOf(key) > -1)
            ? memo[key]
            : (memo[key] = func.apply(this, arguments));
    };
};

// const queryString = require('query-string');
const uriTemplate = memoize(require('uri-templates'));

const componentMap = require('./componentMap');


const routingTable = {
    "dummy": "/#",
    "/feed": "/feed"
    // {url:"/about-us", endpoint:"about-us"},
    // {url:"/act", endpoint:"act"},
    // {url:"/add-org", endpoint:"add-org"},
    // {url:"/playground", endpoint:"playground"},
    // {url:"/resend-verification{?login}", endpoint:"resend-verification"},
    // {url:"/search/v2{?search_type,csrc}", endpoint:"search"},
    // {url:"/simulate-error", endpoint:"simulate-error"},
    // {url:"/step/{step}/{segment}/{identifier}/{+path}", endpoint:"step/track/passthrough"}
};

const parametersByMatchingPatternWithUrl = memoize(
    (pattern, url) => uriTemplate(pattern).fromUri(url),
    (pattern, url) => [pattern, url]
);

var Router;
module.exports = Router = {
    componentTypeForRoute: function componentTypeForRoute(route) {
        return componentMap(route.endpoint);
    },

    urlForRoute: function(route) {
        let urlPattern = routingTable[route.endpoint];
        return uriTemplate(urlPattern).fillFromObject(route.params);
    },

    routeForUrlPath: function(urlPath, params) {
        urlPath = urlPath.replace(/\/$/, '');
        const hits = routingTable.filter(
            (entry) => parametersByMatchingPatternWithUrl(entry.url, urlPath)
        );
        if (hits.length) {
            let route = this.route(hits[0].endpoint,
                parametersByMatchingPatternWithUrl(hits[0].url, urlPath));
            // fill additional parameters
            route.additionalParameters = params || {};
            return route;
        }
    },

    route: function(endpoint, params) {
        params = params || {};
        return {endpoint, params};
    },

    routeToUrl: function(endpoint, params) {
        return Router.urlForRoute(Router.route(endpoint, params));
    },

    routeIsSuitableTargetForClientNavigation: function (route) {
        return this.componentTypeForRoute(route) !== undefined;
    }
};
