const {combineReducers} = require('redux');
const actions = require('./actions');


const actOn = (actionHooks, init) => {
    // emit a reducer func that spits out values based on a prefs obj with
    // action types for keys and static vals or funcs for values. like so:
    // stateKey: actOn({
    //  [ACTION_CODE]: value,
    //  [OTHER_ACTION_CODE]: (action, state) => Object.assign({}, state, {foo: action.bar}
    // }, {default: 'value'}),
    let initialState = init || null;
    return ((state = init, action) => {
        if (action.type in actionHooks) {
            let thediff = actionHooks[action.type];
            if (typeof thediff === 'function') {
                return thediff.call(null, action, state);
            }
            return thediff;
        }
        return state;
    });
};

const actTheSameOn = (actionHooks, thediff, init) => {
    // similar but the same value-or-func for many actions. like:
    // stateKey: actTheSameOn([ACTION_ONE, ACTION_TWO],
    //   (action, state) => Object.assign({}, state, {foo: action.bar})
    // , {default: 'value'}),
    let initialState = init || null;
    return ((state = init, action) => {
        if (actionHooks.indexOf(action.type) > -1) {
            if (typeof thediff === 'function') {
                return thediff(action, state);
            }
            return thediff;
        }
        return state;
    });
};

const serverLoadOnly = (state = null, action) => state;
// we could do more to ensure one-time set, of course, but meh

const perStateKey = {
    flash: serverLoadOnly,
    component: serverLoadOnly,

    errorMessages: actTheSameOn(
        [actions.ROUTING_ERROR, actions.ITEM_PAGE_ERROR, actions.FEED_LOAD_ERROR],
            (action, state) => state.concat([action.type + action.error]),
        []
    ),

    user: actOn({
        [actions.ADD_USER_INFO]: (action) => action.user
    }, {}),

    loadingRoute: actOn({
        [actions.READY_ROUTE]: true,
        [actions.FINALIZE_ROUTE]: false,
        [actions.ROUTING_ERROR]: false
    }, false),
    currentRoute: actOn({
        [actions.FINALIZE_ROUTE]: (action) => action.route,
        [actions.ROUTING_ERROR]: (a, state) => state.currentRoute
    }, {}),

    loadingItems: actOn({
        [actions.READY_ITEM_FETCH_PAGE]: true,
        [actions.RECV_ITEM_PAGE]: false,
        [actions.ITEM_PAGE_ERROR]: false
    }, false),
    items: actOn({
        [actions.RECV_ITEM_PAGE]: (action, state) => {
            return (state.items ? state.items.concat(action.items) : action.items)
    }}, []),

    loadingFeeds: actOn({
        [actions.READY_FETCH_FEEDS]: true,
        [actions.RECV_FEEDS]: false,
        [actions.FEED_LOAD_ERROR]: false
    }, false),
    feeds: actOn({
        [actions.RECV_FEEDS]: function(action, state) {return action.feeds;}
    }, [])
};

let initState = typeof window === 'undefined' ? {} : window.initialData;
module.exports = combineReducers(perStateKey, initState);
