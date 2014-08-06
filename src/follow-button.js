module.exports = FollowButton;

var View = require('view');
var Button = require('streamhub-ui/button');
var Command = require('streamhub-ui/command');
var inherits = require('inherits');
var packageAttribute = require('./package-attribute');
require('less!./styles/follow-button.less');

function FollowButton(opts) {
    var self = this;
    View.apply(this, arguments);
    opts = opts || {};
    opts.label = opts.label || 'follow';
    this.subscription = opts.subscription;
    this._button = new Button(createFollowCommand(opts.subscription));
    this._follow = opts.follow || function (subscription, errback) { errback(); };
    this._unfollow = opts.unfollow || function (subscription, errback) { errback(); };
    if (typeof opts.isFollowing === 'function') {
        opts.isFollowing(this.subscription, function (err, isFollowing) {
            self.setFollowing(isFollowing);
        })
    }
    this.setFollowing(false);
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

FollowButton.prototype.setFollowing = function (isFollowing) {
    var command;
    var errback;
    if (isFollowing) {
        command = createUnfollowCommand(this.subscription, this._unfollow);
        errback = this._unfollowErrback.bind(this);
    } else {
        command = createFollowCommand(this.subscription, this._follow);
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
    this.setFollowing(false);
}

FollowButton.prototype._followErrback = function (err) {
    if (err) {
        return console.error('Error following', err);
    }
    this.setFollowing(true);
}

FollowButton.prototype.setLabel = function (label) {
    this._button._label = label;
    this._button.render();
}

FollowButton.prototype._getLabel = function (isFollowing) {
    return isFollowing ? 'unfollow' : 'follow';
}

function createFollowCommand(subscription, follow) {
    var command = new Command(function (errback) {
        console.log('follow');
        follow(subscription, function (err) {
            if (typeof errback !== 'function') {
                return;
            }
            errback();
        });
    });
    return command;
}

function createUnfollowCommand(subscription, unfollow) {
    var command = new Command(function (errback) {
        console.log('unfollow');
        unfollow(subscription, function (err, res) {
            if (typeof errback !== 'function') {
                return;
            }
            errback();
        });
    });
    return command;
}
