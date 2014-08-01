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

// feed
var CollectionFeed = require('collection-feed');
var topic = 'urn:livefyre:demo.fyre.co:site=362588:topic=sports:topicStream';
var feed = new CollectionFeed.ActivityFeed({
    el: document.getElementById('feed'),
    // activities: new CollectionFeed.Activities(topic),
    activities: new CollectionFeed.PersonalizedActivities(),
    initial: 3
});

var mockActivity = activityMocks.create('livefyre.sitePostCollection');
mockActivity.published = (new Date()).toISOString();
feed.write(mockActivity);
