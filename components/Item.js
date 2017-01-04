"use strict";

const React = require('react');
const moment = require('moment');


module.exports = (props) => {
    let item = props.item;
    let reply = item.type == 'replytome';
    let twitterReply = reply &&
        item.sourceUrl.match(/^https?:\/\/(www\.)?twitter\.com/);
    let replyWithInfo = reply && item.inReplyTo;
    return <article style={
                Object.assign({}, itemStyle,
                    !item.read ? unreadStyle : {},
                    (twitterReply || item.type == 'twitter')
                        ? twitterStyle
                        : (item.type == 'replytome' ? replyStyle : {}))}>
        <header>
            {item.title && <h3 style={itemTitle}>{item.title}</h3>}
            {item.authorUrl
                ? <a href={item.authorUrl}>{item.author || item.authorUrl}</a>
                : <cite className="author">{item.author}</cite>}
            {item.username && <cite className="username">{item.username}</cite>}
            {item.publishDate && <datetime>{moment(item.publishDate).toNow(true)}</datetime>}
            {replyWithInfo && <span>in reply to
                <a href={item.inReplyTo}>{item.inReplyToSummary || 'this of yours'}</a>
            </span>}
        </header>

        <div>{item.body}</div>
    </article>;
}

const itemStyle = {
    width: '100%',
    padding: 10,
    margin: 0,
    marginBottom: 3,
    border: '1px solid #999999',
    backgroundColor: '#eeeeee'
};

const unreadStyle = {
    borderWidth: 3,
    marginBottom: 1
};

const itemTitle = {
    margin: 0,
    display: 'inline'
};

const replyStyle = {
    border: '1px solid goldenrod',
    backgroundColor: '#ffffcc'
};

const twitterStyle = {
    border: '1px solid blue',
    backgroundColor: '#aabbcc'
};
