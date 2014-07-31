var activityToContent = require('collection-as-content');
var activityMocks = require('activity-mocks');
var ContentViewFactory = require('streamhub-sdk/content/content-view-factory');
var asLivefyreContentView = require('streamhub-sdk/content/views/mixins/livefyre-content-view-mixin');



// auth
var createAuthButton = require('auth/contrib/auth-button');
var auth = require('livefyre-auth');
var authButton = createAuthButton(auth, document.getElementById('auth-button'));
var delegate = window.delegate = auth.createDelegate('http://www.livefyre.com');
auth.delegate(delegate);

var cvf = new ContentViewFactory();
var createContentView = cvf.createContentView.bind(cvf);

var activity = activityMocks.create('livefyre.sitePostCollection');
var content = activityToContent(activity);
if (content.extensions && content.extensions.abstract) {
    content.set({
        body: content.extensions.abstract
    })
}

var contentView = createContentView(content);

contentView.setElement(document.getElementById('main'));
contentView.render();

Livefyre.require(['streamhub-feed#3'], function (Feed) {
    // feed
    var feed = new Feed({
        el: document.getElementById('feed')
    });
    feed.write(content);
})
