"use strict";

const Router = require('./router');
const { apiFetch } = require('./serverFetch');


const actions = {
    READY_ROUTE: 'READY_ROUTE',
    FINALIZE_ROUTE: 'FINALIZE_ROUTE',
    ROUTING_ERROR: 'ROUTING_ERROR',
    READY_ITEM_FETCH_PAGE: 'READY_ITEM_FETCH_PAGE',
    RECV_ITEM_PAGE: 'RECV_ITEM_PAGE',
    ITEM_PAGE_ERROR: 'ITEM_PAGE_ERROR',
    READY_FETCH_FEEDS: 'READY_FETCH_FEEDS',
    RECV_FEEDS: 'RECV_FEEDS',
    FEED_LOAD_ERROR: 'FEED_LOAD_ERROR',
    ADD_FLASH_AND_COMPONENT_NAME: 'ADD_FLASH_AND_COMPONENT_NAME',
    ADD_USER_INFO: 'ADD_USER_INFO',
    TOGGLE_ADD_FEED: 'TOGGLE_ADD_FEED',
    READY_SUB_FEED: 'READY_SUB_FEED',
    SUB_FEEDS_OK: 'SUB_FEEDS_OK',
    SUB_FEEDS_ERR: 'SUB_FEEDS_ERR',


    doInitialActions: (actions, options) =>
        (dispatch) =>
            Promise.all(actions.map(action => action(dispatch, options))),

    routeTo: (route) => (dispatch) => {
        let Compy = Router.componentTypeForRoute(route);
        if (Compy) {
            dispatch({type: actions.READY_ROUTE});
            if (Compy.initialActions) {
                dispatch(actions.doInitialActions(Compy.initialActions({}, {})))
                .then(() =>
                    dispatch({type: actions.FINALIZE_ROUTE, route})
                ).catch(error =>
                    dispatch({type: actions.ROUTING_ERROR, error})
                );
            } else {
                dispatch({type: actions.FINALIZE_ROUTE, route});
            }
        } else {
            // fall back to actual HTTP-ass loading?
            dispatch({type: actions.ROUTING_ERROR, error: 'No component'});
        }
    },

    routeWithoutLoad: (route) => { return {type: actions.FINALIZE_ROUTE, route}; },

    getItemsPage: (page = 1, opts = {}) => (dispatch) => {
        opts.page = page;
        dispatch({type: actions.READY_ITEM_FETCH_PAGE});
        return apiFetch('/items', opts).then(
            response => response.json().then(items =>
                dispatch({ type: actions.RECV_ITEM_PAGE, items: JSON.parse(items) })
            ).catch(error =>
                dispatch({type: actions.ITEM_PAGE_ERROR, error})
            )
        ).catch(error =>
            dispatch({type: actions.ITEM_PAGE_ERROR, error})
        );
    },

    getUserFeeds: (opts) => (dispatch) => {
        dispatch({type: actions.READY_FETCH_FEEDS});
        return apiFetch('/feeds', opts).then(
            response => response.json().then(feeds =>
                dispatch({type: actions.RECV_FEEDS, feeds: JSON.parse(feeds)})
            ).catch(error =>
                dispatch({type: actions.FEED_LOAD_ERROR, error})
            )
        ).catch(error =>
            dispatch({type: actions.FEED_LOAD_ERROR, error})
        );
    },

    addFlashAndComponentName: (flash, componentName) => {
        return {
            type: actions.ADD_FLASH_AND_COMPONENT_NAME,
            flash,
            componentName
        };
    },

    addUserInfo: (userObj) => {
        let user = {};
        if (Object.keys(userObj).length) {
            user = {username: userObj.username};
        }
        return {
            type: actions.ADD_USER_INFO,
            user
        };
    },

    toggleAddFeed: function() {
        return {
            type: actions.TOGGLE_ADD_FEED
        };
    },

    sendSubscribeFeed: (form) => (dispatch) => {
        dispatch({type: actions.READY_SUB_FEED});
        let formData = new FormData(form);
        return apiFetch('/feeds', {method: 'POST', body: formData}).then(
            response => response.formData().then(() =>
                dispatch({
                    type: actions.SUB_FEEDS_OK,
                    feed: formData.getAll('feedUrl')
                })
            ).catch(error =>
                dispatch({type: actions.SUB_FEEDS_ERR, error})
            )
        ).catch(error =>
            dispatch({type: actions.SUB_FEEDS_ERR, error})
        );
    }
};

module.exports = actions;
