var FollowButtonFactory = require('collection-feed/follow-button-factory');
var createAuthButton = require('auth/contrib/auth-button');
var FollowButton = require('collection-feed/follow-button');
var auth = require('livefyre-auth');
var authButton = createAuthButton(auth, document.getElementById('auth-button'));
var delegate = window.delegate = auth.createDelegate('http://www.livefyre.com');
// auth.delegate(delegate);
var token = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJkb21haW4iOiAiZGVtby5meXJlLmNvIiwgImV4cGlyZXMiOiAxNDA5Mjc4ODg4LjgyMDM0OSwgInVzZXJfaWQiOiAic3lzdGVtIn0.EqskRFnL_Ewp41veS8mMBNlGWQYcQ1MW-x9cqVrHcPM';
auth.authenticate({
    livefyre: token
});

var dropdownEl = document.getElementById('rosstest');
var Dropdown = require('collection-feed/follow-dropdown');

var fbFactory = new FollowButtonFactory();
var drop = new Dropdown({
  followButton: fbFactory.create.bind(fbFactory),
  tags: [{
      "id": "urn:livefyre:livefyre.com:site=286470:topic=123",
      "displayName": "Topic 123",
      "objectType": "topic"
  },{
      "id": "urn:livefyre:livefyre.com:topic=ABC",
      "displayName": "Topic ABC - Network",
      "objectType": "topic"
  }]
});

drop.setElement(dropdownEl);
drop.render();
