const express = require('express');
const router = express.Router();

const db = require('./db');


router.use((req, res, next) => {
    if (!db.users) {
        res.redirect('/setup');
    } else {
        next();
    }
});

let blockUnauthed = function(req, res, next) {
    if (!req.user) {
        console.log('blockUnauthed: ', req.originalUrl);
        res.status(403).json({error: 'Please log in to use this API endpoint.'});
    }
    else next();
}

// trying our luck with how singleton-ish passport is
router.get('/items', blockUnauthed, (req, res) => {
    console.log('api hit: /items');
    res.json(JSON.stringify([
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
            feedId: '11',
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
            feedId: '22',
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
            feedId: '33',
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
            feedId: '44',
            avatarUrl: '',
            inReplyTo: 'https://gibberish.com/2016/10/31/cats-are-rad',
            inReplyToSummary: 'Cats are rad!',
            publishDate: '2016-10-31 12:42:33',
            body: 'I agree!'
        }
    ]));
});

router.get('/feeds', blockUnauthed, (req, res) => {
    console.log('api hit: /feeds');
    res.json(JSON.stringify([
        {
            id: '11',
            title: 'Feed 11',
            newPosts: 0
        },
        {
            id: '22',
            title: 'Feed 22',
            newPosts: 3
        },
        {
            id: '33',
            title: 'Feed 33',
            newPosts: 12
        },
        {
            id: '44',
            title: 'Feed 44',
            newPosts: 0
        }
    ]));
});

module.exports = router;
