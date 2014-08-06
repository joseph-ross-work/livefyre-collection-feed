module.exports = FollowButtonFactory;

var FollowButton = require('./follow-button');
var subscriptionsClient = require('./subscriptions-client');
var auth = require('auth');

function FollowButtonFactory(opts) {
    opts = opts || {};
    this._isFollowing = opts.isFollowing || createIsFollowing();
}

FollowButtonFactory.prototype.create = function (subscription) {
    var button = new FollowButton({
        subscription: subscription,
        isFollowing: this._isFollowing,
        follow: follow,
        unfollow: unfollow
    });
    button.render();
    auth.on('logout', function () {
        button.setFollowing(false);
    })
    return button.el;
};

function follow(subscription, errback) {
  // if user isnt logged in, log them in first.
  var user = auth.get('livefyre');
  if (user) {
    followWithUser(user);
  } else {
    auth.once('login.livefyre', followWithUser);
    auth.login();
  }
  function followWithUser(user) {
    subscriptionsClient.create({
      lftoken: user.get('token'),
      // todo: followButton should support opts.subscription not opts.topic
      subscriptions: [subscription]
    }, function (err, res) {
      errback(err, res);
    })
  }
}

function unfollow(subscription, errback) {
  withUser(function (user) {
    subscriptionsClient.delete({
      lftoken: user.get('token'),
      // todo: followButton should support opts.subscription not opts.topic
      subscriptions: [subscription]
    }, function (err, res) {
      errback(err, res);
    })
  })
}

function createIsFollowing() {
  var subscriptions = null;
  var gettingSubscriptions = false;
  var onSubscriptions = [];
  function finishAll() {
    var cb;
    while (cb = onSubscriptions.pop()) {
      cb();
    }
  }
  return function (subscription, errback) {
    function finish(err) {
      errback(err, subscriptionsContain(subscriptions, subscription))
    }
    withUser(function (user) {
      var token = user.get('token');
      // once we have it memoized, just call errback
      if (subscriptions) {
        return finish();
      }
      // if we're currently getting it, add this errback to the
      // array of folks waiting
      if (gettingSubscriptions) {
        return onSubscriptions.push(finish);
      }
      onSubscriptions.push(finish);
      gettingSubscriptions = true;
      subscriptionsClient.get({
        lftoken: token
      }, function (err, subs) {
        subscriptions = subs || [];
        gettingSubscriptions = false;
        finishAll();
      });
    });
  }
}

function subscriptionsContain(subscriptions, subscription) {
  var subscribedTopics = subscriptions
    .map(function (s) {
      return s.to
    });
  var thisSubscriptionTopic = subscription.to;
  return subscribedTopics.indexOf(thisSubscriptionTopic) !== -1;
}

function withUser(callback) {
  var user = auth.get('livefyre');
  if (user) {
    return callback(user);
  } else {
    auth.once('login.livefyre', callback);
  }
}
