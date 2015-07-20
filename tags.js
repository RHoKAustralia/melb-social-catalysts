var sqlite3 = require('sqlite3');
var express = require('express');
var moment = require('moment');
var fs = require('fs');

var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 2000;

var config = require('./ghost/config');
var dbfile = config[env].database.connection.filename;

function processTag(tag) {
    return {
        name: tag.name,
        url: '/tag/' + tag.slug
    };
}

function _LOG(ACTION, MESSAGE) {
    var output = [
        '[', ACTION, ']',
        ' ', MESSAGE, ' ',
        '[', (new Date()).toString(), ']'
    ];
    console.log(output.join(''));
}

function xhrMiddleware(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    next();
}

function getTags(cb) {
    var db = new sqlite3.Database(dbfile);

    var SQL = 'select distinct tags.name, tags.slug, posts.published_at as last_published_at ' +
        'from tags, posts, posts_tags ' +
        'where tags.id = posts_tags.tag_id and posts.id = posts_tags.post_id ' +
        'group by tags.name, tags.slug ' +
        'order by last_published_at desc';

    db.serialize(function() {
        db.all(SQL, function(err, rows) {
            if (err) {
                return cb(err);
            }
            var tags = rows.map(processTag);
            _LOG('GET', 'FETCHED TAGS: ' + rows.length);
            db.close();
            db = null;
            return cb(false, tags);
        })
    });
}

function resonseWithTags(req, res) {
    getTags(function(err, tags) {
        if (err) {
            res.status(500);
        } else {
            res.json(tags);
        }
    });
}

function writeDataFile() {
    getTags(function(err, tags) {
        if (err) {
            throw err;
        }
        fs.writeFileSync('ghost/content/themes/social-catalysts/assets/tags.json', JSON.stringify(tags));
    });
}

function started() {
    _LOG('STARTED', 'GHOST TAGS SERVICE: PORT ' + port);
}

function startService() {
    var app = express();
    app.use(xhrMiddleware);
    app.get('/', getTags);
    app.listen(port, started);
}

writeDataFile();
