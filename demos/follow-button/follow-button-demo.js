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
var topics = subscriptions.map(function (subscription) {
    return subscription.to;
})
var followButtons = []
topics.forEach(function (topic) {
    var button = new FollowButton({
        topic: topic,
        follow: function (subscription, errback) {
          withUser(function (user) {
            subscriptionsClient.create({
              lftoken: user.get('token'),
              // todo: followButton should support opts.subscription not opts.topic
              subscriptions: [subscriptions[0]]
            }, function (err, res) {
              errback(err, res);
            })
          })
        }
    });
    followButtons.push(button);
    button.render();
    followButtonsEl.appendChild(button.el);
})

var subscription = {
  "to": "urn:livefyre:demo.fyre.co:site=362588:topic=los_angeles",
  "type": "personalStream"
};
var subscriptionsClient = require('collection-feed/subscriptions-client');

withUser(function (user) {
  subscriptionsClient.get({
    lftoken: user.get('token')
  }, function (err, subs) {
    console.log('subscriptions', subs);
  });
  subscriptionsClient.create({
    lftoken: user.get('token'),
    subscriptions: [subscription]
  }, function (err, res) {
    console.log('subscribed', res);
  })
})


function withUser(callback) {
  var user = auth.get('livefyre');
  if (user) {
    return callback(user);
  } else {
    auth.once('login.livefyre', callback);
  }
}
