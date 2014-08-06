var activityMocks = require('activity-mocks');

// auth

var createAuthButton = require('auth/contrib/auth-button');
var auth = require('livefyre-auth');
var authButton = createAuthButton(auth, document.getElementById('auth-button'));
var delegate = window.delegate = auth.createDelegate('http://www.livefyre.com');
// auth.delegate(delegate);
var token = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJkb21haW4iOiAiZGVtby5meXJlLmNvIiwgImV4cGlyZXMiOiAxNDA5Mjc4ODg4LjgyMDM0OSwgInVzZXJfaWQiOiAic3lzdGVtIn0.EqskRFnL_Ewp41veS8mMBNlGWQYcQ1MW-x9cqVrHcPM';
auth.authenticate({
    livefyre: token
});

var subscriptionsClient = require('collection-feed/subscriptions-client');
var FollowButton = require('collection-feed/follow-button');
var followButtonsEl = document.getElementById('follow-buttons');
var subscriptions = [
  {
    "to": "urn:livefyre:demo.fyre.co:site=362588:topic=los_angeles",
    "type": "personalStream"
  },
  {
    "to": "urn:livefyre:demo.fyre.co:site=362588:topic=mlb",
    "type": "personalStream"
  },
  {
    "to": "urn:livefyre:demo.fyre.co:site=362588:topic=business",
    "type": "personalStream"
  },
  {
    "to": "urn:livefyre:demo.fyre.co:site=362588:topic=sports",
    "type": "personalStream"
  },
  {
    "to": "urn:livefyre:demo.fyre.co:site=362588:topic=entertainment",
    "type": "personalStream"
  }
];

var isFollowing = (function () {
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
}())

function subscriptionsContain(subscriptions, subscription) {
  var subscribedTopics = subscriptions
    .map(function (s) {
      return s.to
    });
  var thisSubscriptionTopic = subscription.to;
  return subscribedTopics.indexOf(thisSubscriptionTopic) !== -1;
}

var followButtons = [];
subscriptions.forEach(function (subscription) {
    var button = new FollowButton({
        subscription: subscription,
        isFollowing: isFollowing,
        follow: function (subscription, errback) {
          withUser(function (user) {
            subscriptionsClient.create({
              lftoken: user.get('token'),
              // todo: followButton should support opts.subscription not opts.topic
              subscriptions: [subscription]
            }, function (err, res) {
              errback(err, res);
            })
          })
        },
        unfollow: function (subscription, errback) {
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
    });
    followButtons.push(button);
    button.render();
    var topicEl = document.createElement('div');
    topicEl.appendChild(document.createTextNode(subscription.to));
    topicEl.appendChild(button.el);
    followButtonsEl.appendChild(topicEl);
})

var subscription = {
  "to": "urn:livefyre:demo.fyre.co:site=362588:topic=los_angeles",
  "type": "personalStream"
};

// withUser(function (user) {
//   var token = user.get('token');
//   subscriptionsClient.get({
//     lftoken: token
//   }, function (err, subs) {
//     console.log('subscriptions', subs);
//   });
//   subscriptionsClient.create({
//     lftoken: token,
//     subscriptions: [subscription]
//   }, function (err, res) {
//     console.log('subscribed', res);
//   });
//   subscriptionsClient.delete({
//     lftoken: token,
//     subscriptions: [subscription]
//   }, function (err, res) {
//     console.log('deleted', res);
//   })
// })


function withUser(callback) {
  var user = auth.get('livefyre');
  if (user) {
    return callback(user);
  } else {
    auth.once('login.livefyre', callback);
  }
}
