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

const queryString = require('query-string');
const uriTemplate = memoize(require('uri-templates'));
const fetch = require('isomorphic-fetch');

const componentMap = require('./componentMap');

const config = require('../config.json');


// endpoint: 'urlPattern'
const apiRoutingTable = {
    "/items": "/api/items{?page}",
    "/feeds": "/api/feeds"
    // {url:"/api/{lang}/v1/countries/{country_geoid}", endpoint:"geo/regions"},
    // {url:"/api/{lang}/v1/locations{?type,q}", endpoint:"geo/search"}
};

// do not duplicate endpoint keys pls
const navigationRoutingTable = {
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

const routingTable = Object.assign({}, apiRoutingTable, navigationRoutingTable);
// and that is why we don't dupe endpoint keys ok thx

const parametersByMatchingPatternWithUrl = memoize(
    (pattern, url) => uriTemplate(pattern).fromUri(url),
    (pattern, url) => [pattern, url]
);

const Router = {
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

    apiUrl: function(endpt, params) {
        return config.SITE_URL + Router.routeToUrl(endpt, params);
    },

    apiFetch: function(endpt, params) {
        let fetchOpts = {};
        if (params.cookie) {
            fetchOpts['headers'] = {'Cookie': params.cookie};
            delete params.cookie;
        }
        return fetch(Router.apiUrl(endpt, params), fetchOpts);
    },

    routeIsSuitableTargetForClientNavigation: function (route) {
        return this.componentTypeForRoute(route) !== undefined;
    }
};

module.exports = Router;
