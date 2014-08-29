module.exports = PersonalizedActivityCollection;

var ActivityCollection = require('./activities');
var PassThrough = require('stream/passthrough');
var auth = require('auth');
var base64 = require('base64');
var EventEmitter = require('event-emitter');

function PersonalizedActivityCollection(opts) {
    var self = this;
    // we'll set this to an activityCollection whenever the user logs in
    this._activities = null;
    this._events = new EventEmitter();
    this._environment = opts.environment;
    console.log('opts ', opts)
    if (opts.token) {
        this._setToken(opts.token, opts.environment);
    } else {
        console.log('without token')
        withUser(function (user) {
            self._setToken(user.get('token'), opts.environment);
        });
    }
};

PersonalizedActivityCollection.prototype._setToken = function (token, env) {
    console.log(arguments)
    var tokenData = parseToken(token);
    var topic = personalizedTopic(tokenData.network, tokenData.userId);
    var activityCollection = new ActivityCollection({
        topic: topic,
        token: token,
        environment: env
    });
    this._activities = activityCollection;
    this._events.emit('activities', activityCollection);
};

PersonalizedActivityCollection.prototype.createUpdater = function () {
    if (this._activities) {
        return this._activities.createUpdater();
    }
    var updater = new PassThrough();
    this._events.once('activities', function (activities) {
        activities.createUpdater().pipe(updater);
    });
    return updater;    
};

PersonalizedActivityCollection.prototype.createArchive = function () {
    if (this._activities) {
        return this._activities.createArchive();
    }
    var archive = new PassThrough();
    this._events.once('activities', function (activities) {
        activities.createArchive().pipe(archive);
    });
    return archive;
};

function parseToken(token) {
    var parts = token.split('.');
    var dataPart = parts[1];
    var data = JSON.parse(base64.url.atob(dataPart));
    return {
        network: data.domain,
        userId: data.user_id
    };
}

function personalizedTopic(network, userId) {
    var template = 'urn:livefyre:{{network}}:user={{userId}}:personalStream';
    var topic = template
        .replace('{{network}}', network)
        .replace('{{userId}}', userId);
    return topic;
}

function withUser(cb) {
    var user = auth.get('livefyre');
    if ( ! user) {
        auth.on('login.livefyre', cb);
    } else {
        cb(user);
    }
}
