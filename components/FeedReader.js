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
                <main style={outerStyle}>
                    <ul style={listStyle}>
                        {this.props.items.map(item => <li key={item.id}><Item item={item} /></li>)}
                    </ul>
                </main>
            </PageWrapper>
        )
    }

    renderNav() {
        return <ul>
            <li><a href="#">Settings</a></li>
            <li><a href="#">Add Feed</a></li>

            <li><a href="#">Everything</a></li>
            {this.props.feeds && this.props.feeds.map((feed) =>
                <li key={feed.id} className={feed.newPosts > 0 ? 'new' : ''}>
                    <a href="#">{feed.title}</a>&nbsp;
                    <span>({feed.newPosts})</span>
                </li>
            )}
        </ul>
    }
}

const outerStyle = {
    margin: '10px auto',
    width: 740
};
const listStyle = {
    display: 'inline',
    listStyle: 'none',
    margin: 0
};

module.exports = connect((state) => {return {
    items: state.items,
    feeds: state.feeds
}})(FeedReader);
