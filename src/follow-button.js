module.exports = FollowButton;

var View = require('view');
var Button = require('streamhub-ui/button');
var Command = require('streamhub-ui/command');
var inherits = require('inherits');
var packageAttribute = require('./package-attribute');
require('less!./styles/follow-button.less');

function FollowButton(opts) {
    View.apply(this, arguments);
    opts = opts || {};
    opts.label = opts.label || 'follow';
    this.topic = opts.topic;
    this._button = new Button(createFollowCommand(opts.topic));
    this._setFollowing(false);
    this._button.$el.addClass('lf-btn-default');
    this._button.$el.addClass('lf-btn-xs');
};
inherits(FollowButton, View);

FollowButton.prototype.elClass += ' lf-follow-button';

FollowButton.prototype.render = function () {
    View.prototype.render.apply(this, arguments);
    var span = document.createElement('span');
    span.classList.add('lf-follow-button');
    this._button.render();
    span.appendChild(this._button.el);
    this.el.appendChild(span);
};

FollowButton.prototype.setElement = function () {
    if (this.el) {
        packageAttribute.undecorate(this.el);
    }
    var ret = View.prototype.setElement.apply(this, arguments);
    packageAttribute.decorate(this.el);
    return ret;
}

FollowButton.prototype._setFollowing = function (isFollowing) {
    var command;
    var errback;
    console.log('_setFollowing', isFollowing);
    if (isFollowing) {
        command = createUnfollowCommand();
        errback = this._unfollowErrback.bind(this);
    } else {
        command = createFollowCommand();
        errback = this._followErrback.bind(this);
    }
    this._button._setCommand(command);
    this._button._errback = errback;
    this.setLabel(this._getLabel(isFollowing))
}

FollowButton.prototype._unfollowErrback = function (err) {
    if (err) {
        return console.error('Error unfollowing', err);
    }
    this._setFollowing(false);
}

FollowButton.prototype._followErrback = function (err) {
    if (err) {
        return console.error('Error following', err);
    }
    this._setFollowing(true);
}

FollowButton.prototype.setLabel = function (label) {
    this._button._label = label;
    this._button.render();
}

FollowButton.prototype._getLabel = function (isFollowing) {
    return isFollowing ? 'unfollow' : 'follow';
}

function createFollowCommand(topic) {
    var command = new Command(function (errback) {
        console.log('follow');
        if (typeof errback !== 'function') {
            return;
        }
        errback();
    });
    return command;
}

function createUnfollowCommand(topic) {
    var command = new Command(function (errback) {
        console.log('unfollow');
        if (typeof errback !== 'function') {
            return;
        }
        errback();
    });
    return command;
}
