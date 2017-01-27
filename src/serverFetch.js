const config = require('../clientConfig');

const uriTemplate = require('uri-templates');
const fetch = require('isomorphic-fetch');


// endpoint: 'urlPattern'
const apiRoutingTable = {
    "/items": "/api/items{?page}",
    "/feeds": "/api/feeds"
    // {url:"/api/{lang}/v1/countries/{country_geoid}", endpoint:"geo/regions"},
    // {url:"/api/{lang}/v1/locations{?type,q}", endpoint:"geo/search"}
};

const ServerFetch = {
    apiUrl: function(endpoint, params) {
        let urlPattern = apiRoutingTable[endpoint];
        return config.DEV_BASE_URL + uriTemplate(urlPattern).fillFromObject(params);
    },

    apiFetch: function(endpt, params) {
        let fetchOpts = Object.assign({}, params);
        if (typeof document !== 'undefined') {
            fetchOpts['credentials'] = 'same-origin';
        }
        if (!!params.cookie) {
            fetchOpts.headers = {'Cookie': params.cookie};
        }
        // console.log('apiFetch', fetchOpts);
        return fetch(ServerFetch.apiUrl(endpt, params), fetchOpts);
    }
};

module.exports = ServerFetch;
