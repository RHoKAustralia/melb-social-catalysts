var sqlite3 = require('sqlite3');
var express = require('express');
var moment = require('moment');

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
    next();
}

function getTags(req, res) {
    var db = new sqlite3.Database(dbfile);
    db.serialize(function() {
        db.all("select * from tags", function(err, rows) {
            var tags = rows.map(processTag);
            _LOG('GET', 'FETCHING TAGS');
            db.close();
            res.json(tags);
            db = null;
        })
    });
}

function started() {
    _LOG('STARTED', 'GHOST TAGS SERVICE: PORT ' + port);
}

var app = express();

app.use(xhrMiddleware);

app.get('/', getTags);

app.listen(port, started);
