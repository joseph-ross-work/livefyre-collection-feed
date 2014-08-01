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
function ActivityCollection(topic) {
    this._topic = topic;
}

/**
 * Create a stream that reads historical activities.
 * Returns a PassThrough that will have the ChronosStream piped into it
 * once a user is logged in.
 */
ActivityCollection.prototype.createArchive = function () {
    var archive = new PassThrough();
    var topic = this._topic;
    withUser(function (user) {
        var chronosStream = new ChronosStream(topic);
        chronosStream.auth(user.get('token'));
        chronosStream.pipe(archive);
    });
    return archive;
};

/**
 * Create a stream that reads future activities
 */
ActivityCollection.prototype.createUpdater = function () {
    var updater = new StreamClient({
        debug: true,
        environment: 'production'
    });
    var topic = this._topic;
    withUser(function (user) {
        // TODO: Don't do this. It's probably a bug with stream-v4?
        topic = topic.replace(/:site=(\d+)/,'');
        updater.connect(user.get('token'), topic);
    });
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
