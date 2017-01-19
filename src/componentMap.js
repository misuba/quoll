const componentNamesByEndpoint = {
    //'/': BlogTop,
    '/setup': 'SetupOne',
    '/login': 'LoginPage',
    '/feed': 'FeedReader'
    //'/settings': Admin,
    //'/new': EditPost
};

module.exports = function componentMap(route) {
    let compName = componentNamesByEndpoint[route];
    if (compName) {
        return require('../components/' + compName);
    }
    return null;
}
