module.exports = ActivityCollection;

var ChronosStream = require('chronos-stream');
var StreamClient = require('stream-client');
var auth = require('auth');
var PassThrough = require('stream/passthrough');

/**
 * A streamhub-sdk/collection-like object that sources
 * from personalized news stream services (chronos + stream-v4)
 * @param topic {string} The topic you want activities for
 *   e.g. 'urn:livefyre:demo.fyre.co:site=362588:topic=mlb:topicStream'
 */
function ActivityCollection(opts) {
    if(typeof opts !== 'object')
        throw new Error('ActivityCollection requires arguments')

    this._topic = opts.topic;
    this._token = opts.token;
    this._environment = opts.environment;
}

/**
 * Create a stream that reads historical activities.
 * Returns a PassThrough that will have the ChronosStream piped into it
 * once a user is logged in.
 */
ActivityCollection.prototype.createArchive = function () {
    var archive = new PassThrough();
    var topic = this._topic;
    var token = this._token;
    var chronosStream = new ChronosStream(topic, {
        highWaterMark: 1,
        environment: this._environment
    });
    if (token) {
        withToken(token)
    } else {
        withUser(function (user) {
            withToken(user.get('token'));
        });
    }
    function withToken(token) {
        chronosStream.auth(token);
        chronosStream.pipe(archive);        
    }
    return archive;
};

/**
 * Create a stream that reads future activities
 */
ActivityCollection.prototype.createUpdater = function () {
    var updater = new StreamClient({
        environment: this._environment
    });
    var topic = this._topic;
    var token = this._token;
    if (token) {
        withToken(token);
    } else {
        withUser(function (user) {
            withToken(user.get('token'));
        });
    }
    function withToken(token) {
        updater.connect(token, topic);
    }
    return updater;
};

function withUser(cb) {
    var user = auth.get('livefyre');
    if ( ! user) {
        auth.on('login.livefyre', cb);
    } else {
        cb(user);
    }
}
