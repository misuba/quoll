const React = require('react');
const {connect} = require('react-redux');

const actions = require('../src/actions');

const Item = require('./Item');
const PageWrapper = require('./PageWrapper');


class FeedReader extends React.Component {
    static initialActions(props, user, cb) {
        console.log('feedrdr initialData');
        return [
            (dispatch, opts) => dispatch(actions.getItemsPage(1, opts)),
            (dispatch, opts) => dispatch(actions.getUserFeeds(opts))
        ];
    }

    static getInitialProps(props, user, cb) {
        cb(Object.assign(props, {user}, {
            items: [
                {
                    id: 'dsubeubs',
                    read: false,
                    receivesMentions: true,
                    replies: [
                        'https://foo.com/2030/45/33/yeah',
                        'https://bar.com/2030/45/33/uh-huh',
                        'https://baz.com/2030/45/33/thats-right',
                    ],
                    title: 'An Item Appears',
                    author: 'Author Author',
                    sourceTitle: 'AuthorBlog',
                    sourceUrl: 'https://author.tumblr.com',
                    publishDate: '2016-10-31 12:45:33',
                    body: 'Lorem ipsum dolor sit amet, accenture delacourt in rese. Lorem ipsum dolor sit amet, accenture delacourt in rese. Lorem ipsum dolor sit amet, accenture delacourt in rese. Lorem ipsum dolor sit amet, accenture delacourt in rese. Lorem ipsum dolor sit amet, accenture delacourt in rese. Lorem ipsum dolor sit amet, accenture delacourt in rese. '
                },
                {
                    id: 'gfyrsdtyvj',
                    read: false,
                    receivesMentions: true,
                    type: 'twitter',
                    author: 'Unblemished',
                    authorUrl: 'https://twitter.com/brendn/',
                    username: 'brendanadkins',
                    sourceUrl: 'https://twitter.com/brendn/status/eiheugeugejej',
                    avatarUrl: '',
                    publishDate: '2016-10-31 12:44:33',
                    body: 'This is a good tweet, one of the best, everyone says so'
                },
                {
                    id: 'drtstghlkl',
                    read: false,
                    receivesMentions: false,
                    title: 'An Item Appears',
                    author: 'Author Author',
                    sourceTitle: 'AuthorBlog',
                    sourceUrl: 'https://author.tumblr.com',
                    publishDate: '2016-10-31 12:43:33',
                    body: 'Lorem ipsum dolor sit amet, accenture delacourt in rese. Lorem ipsum dolor sit amet, accenture delacourt in rese. Lorem ipsum dolor sit amet, accenture delacourt in rese. Lorem ipsum dolor sit amet, accenture delacourt in rese. Lorem ipsum dolor sit amet, accenture delacourt in rese. Lorem ipsum dolor sit amet, accenture delacourt in rese. '
                },
                {
                    id: 'hfdfjklkkkk',
                    read: false,
                    receivesMentions: true,
                    type: 'replytome',
                    author: 'Harry Styles',
                    sourceUrl: 'https://harrystyles.com/2016/10/31/i-agree',
                    avatarUrl: '',
                    inReplyTo: 'https://gibberish.com/2016/10/31/cats-are-rad',
                    inReplyToSummary: 'Cats are rad!',
                    publishDate: '2016-10-31 12:42:33',
                    body: 'I agree!'
                }
            ]
        }));
    }

    render() {
        console.log('ffeedr render', '"' + this.props.items + '"');
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
                <li key={feed.id}><a href="#">{feed.title}</a></li>
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
    items: state.items
}})(FeedReader);
