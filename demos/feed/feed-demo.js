var activityMocks = require('activity-mocks');

// auth
var createAuthButton = require('auth/contrib/auth-button');
var auth = require('livefyre-auth');
var authButton = createAuthButton(auth, document.getElementById('auth-button'));
var delegate = window.delegate = auth.createDelegate('http://www.livefyre.com');
auth.delegate(delegate);

// feed
var ActivityFeed = require('collection-as-content/activity-feed');
var feed = new ActivityFeed({
    el: document.getElementById('feed'),
    initial: 3
});

// stream it

var ChronoStream = require('chronos-stream');

var stream = new ChronoStream('urn:livefyre:demo.fyre.co:site=362588:topic=mlb:topicStream');
stream.auth('eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJkb21haW4iOiAiZGVtby5meXJlLmNvIiwgImV4cGlyZXMiOiAxNDA5Mjc4ODg4LjgyMDM0OSwgInVzZXJfaWQiOiAic3lzdGVtIn0.EqskRFnL_Ewp41veS8mMBNlGWQYcQ1MW-x9cqVrHcPM');

stream.pipe(feed.more);
// stream.on('data', function (activity) {
//     console.log('chronos data', activity);
//     feed.write(activity);
// })

var mockActivity = activityMocks.create('livefyre.sitePostCollection');
mockActivity.published = (new Date()).toISOString();
feed.write(mockActivity);
