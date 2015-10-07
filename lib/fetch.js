var sqlite3 = require('sqlite3');
var moment = require('moment');
var fs = require('fs');

var env = process.env.NODE_ENV || 'development';

var config = require('../ghost/config');
var dbfile = config[env].database.connection.filename;

function _LOG(ACTION, MESSAGE) {
    var output = [
        '[', ACTION, ']',
        ' ', MESSAGE, ' ',
        '[', (new Date()).toString(), ']'
    ];
    console.log(output.join(''));
}

function getData(dataLabel, sqlStatement, processFunction, cb) {
    var db = new sqlite3.Database(dbfile);

    db.serialize(function() {
        db.all(sqlStatement, function(err, rows) {
            if (err) {
                return cb(err);
            }
            var processedRows = rows.map(processFunction);
            _LOG('GET', 'FETCHED ' + dataLabel.toUpperCase() + ': ' + rows.length);
            db.close();
            db = null;
            return cb(false, processedRows);
        })
    });
}

function writeDataFile(dataLabel, sqlStatement, processFunction, outputPath) {
    getData(dataLabel, sqlStatement, processFunction, function(err, processedRows) {
        if (err) {
            throw err;
        }
        fs.writeFileSync(outputPath, JSON.stringify(processedRows));
    });
}

exports.now = function(options) {
    var dataLabel = options.dataLabel;
    var sqlStatement = options.sqlStatement;
    var processFunction = options.processFunction;
    var outputPath = options.outputPath;
    writeDataFile(dataLabel, sqlStatement, processFunction, outputPath);
};
