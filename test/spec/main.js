var activityToContent = require('activity-to-content');
var activityMocks = require('activity-mocks');
var assert = require('chai').assert;

describe('activity-to-content', function () {
    it('is a function', function () {
        assert.instanceOf(activityToContent, Object);
        assert.instanceOf(activityToContent, Function);
    });
    it('can transform a site-post-collection activity', function () {
        var activity = activityMocks.create('livefyre.sitePostCollection');
        assert.instanceOf(activity, Object);
        var content = activityToContent(activity);
        assert.equal(content.title, activity.object.title);
        assert.equal(content.url, activity.object.url);
        // no author in the case of site as actor
        assert.equal(content.author, undefined);
        // collection is created propertly
        assert.typeOf(content.collection.createArchive, 'function');
        assert.ok(content.collection.readable);
        assert.deepPropertyVal(content,
            'collection.articleId', activity.object.articleId);
        assert.deepPropertyVal(content,
            'collection.id', '824379');
        assert.deepPropertyVal(content,
            'collection.siteId', '286470');
        assert.deepPropertyVal(content,
            'collection.network', 'livefyre.com');
        assert.deepPropertyVal(content,
            'collection.url', activity.object.url);
    });
});
