module.exports = ActivityCollection;

var ChronosStream = require('chronos-stream');
var StreamClient = require('stream-client');
var auth = require('auth');

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
 * Create a stream that reads historical activities
 */
ActivityCollection.prototype.createArchive = function () {
    var archive = new ChronosStream(this._topic);
    withUser(function (user) {
        archive.auth(user.get('token'));
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
