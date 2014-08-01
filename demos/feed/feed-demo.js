var activityMocks = require('activity-mocks');
var ActivityFeed = require('collection-as-content/activity-feed');

// auth
var createAuthButton = require('auth/contrib/auth-button');
var auth = require('livefyre-auth');
var authButton = createAuthButton(auth, document.getElementById('auth-button'));
var delegate = window.delegate = auth.createDelegate('http://www.livefyre.com');
auth.delegate(delegate);

// feed
var feed = new ActivityFeed({
    el: document.getElementById('feed')
});

feed.write(activityMocks.create('livefyre.sitePostCollection'));
