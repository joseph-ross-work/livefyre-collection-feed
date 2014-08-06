module.exports = FollowButtonFactory;

var FollowButton = require('./follow-button');
var subscriptionsClient = require('./subscriptions-client');
var auth = require('auth');

function FollowButtonFactory(opts) {
    opts = opts || {};
    this._subscriptions = createSubscriptions();
}

FollowButtonFactory.prototype.create = function (subscription) {
    if (typeof subscription === 'string') {
        subscription = {
            to: subscription
        };
    }
    var subscriptions = this._subscriptions;
    var button = new FollowButton({
        subscription: subscription,
        isFollowing: subscriptions.isFollowing,
        follow: subscriptions.follow,
        unfollow: subscriptions.unfollow
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

function createSubscriptions() {
  var subscriptions = null;
  var gettingSubscriptions = false;
  var onSubscriptions = [];
  function finishAll() {
    var cb;
    while (cb = onSubscriptions.shift()) {
      cb();
    }
  }
  return {
    follow: function (subscription, errback) {
      follow(subscription, function (err, res) {
        if (err) return errback(err, res);
        if (subscriptions === null) {
          // once they're gotten, ensure our local cache
          // knows about this subscription
          onSubscriptions.push(addSubscription);
          return;
        }
        // we has subscriptions
        addSubscription();
        errback(err, res);

        function addSubscription() {
          if ( ! subscriptionsContain(subscriptions, subscription)) {
            subscriptions.push(subscription);
          }
        }
      })
    },
    unfollow: function (subscription, errback) {
      unfollow(subscription, function (err, res) {
        if (err) return errback(err, res);
        if (subscriptions === null) {
          // once they're gotten, ensure our local cache
          // knows about this subscription removal
          onSubscriptions.push(removeSubscription);
          return;
        }
        // we has subscriptions
        removeSubscription();
        errback(err, res);
        
        function removeSubscription() {
          var index = getSubscriptionIndex(subscriptions, subscription);
          if (index === -1) return;
          subscriptions.splice(index, 1);
        }
      })
    },
    isFollowing: function (subscription, errback) {
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
  };
}

function subscriptionsContain(subscriptions, subscription) {
  return getSubscriptionIndex(subscriptions, subscription) !== -1;
}

function getSubscriptionIndex(subscriptions, subscription) {
  var subscribedTopics = subscriptions
    .map(function (s) {
      return s.to
    });
  var thisSubscriptionTopic = subscription.to;
  var index = subscribedTopics.indexOf(thisSubscriptionTopic);
  return index;
}

function withUser(callback) {
  var user = auth.get('livefyre');
  if (user) {
    return callback(user);
  } else {
    auth.once('login.livefyre', callback);
  }
}
