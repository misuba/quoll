const React = require('react');
const {connect} = require('react-redux');

const actions = require('../src/actions');

const Item = require('./Item');
const PageWrapper = require('./PageWrapper');


class FeedReader extends React.Component {
    static initialActions(props, user, cb) {
        return [
            (dispatch, opts) => dispatch(actions.getItemsPage(1, opts)),
            (dispatch, opts) => dispatch(actions.getUserFeeds(opts))
        ];
    }

    render() {
        return (
            <PageWrapper nav={this.renderNav()}>
                <main className="col-md-9">
                    <ul style={listStyle}>
                        {this.props.items.map(item => <li key={item.id}><Item item={item} /></li>)}
                    </ul>
                </main>
            </PageWrapper>
        );
    }

    renderNav() {
        return <ul style={listStyle}>
            <li><a href="#">Settings</a></li>
            <li>
                <button onClick={this.props.cxOnToggleAddFeeds}>
                    {this.props.addingFeeds ? 'Cancel' : 'Add Feed'}
                </button>
                {this.props.addingFeeds && <form onSubmit={this.props.cxOnSubmitFeedsToAdd}>
                    {this.props.sendingAddedFeeds
                        ? <span>adding...</span>
                        : <input type="text" name="feedUrl" defaultValue="" />}
                </form>}
            </li>

            <li><a href="#">Everything</a></li>
            {this.props.feeds && this.props.feeds.map((feed) =>
                <li key={feed.id} className={feed.newPosts > 0 ? 'new' : ''}>
                    <a href="#">{feed.title}</a>&nbsp;
                    <span>({feed.newPosts})</span>
                </li>
            )}
        </ul>;
    }
}

const listStyle = {
    listStyle: 'none',
    paddingLeft: 0
};

module.exports = connect(
    (state) => {return {
        items: state.items,
        feeds: state.feeds || [], //FIXME
        addingFeeds: state.addingFeeds,
        sendingAddedFeeds: state.sendingAddedFeeds
    }},
    (dispatch) => {
        return {
            cxOnToggleAddFeeds: () => {
                dispatch(actions.toggleAddFeed());
            },
            cxOnSubmitFeedsToAdd: (evt) => {
                evt.preventDefault();
                dispatch(
                    actions.sendSubscribeFeed(evt.nativeEvent.target)
                )
            }
        };
    }
)(FeedReader);
