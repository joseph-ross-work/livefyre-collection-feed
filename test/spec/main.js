var activityToContent = require('collection-feed').activityToContent;
var activityMocks = require('activity-mocks');
var assert = require('chai').assert;
var ActivityFeed = require('collection-feed/activity-feed');
var sinon = require('sinon');

describe('collection-feed.activityToContent', function () {
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
        assert.equal(content.id, activity.published);
        assert.equal(Number(content.createdAt), Math.floor(Date.parse(activity.published)));
    });
    it('can transform a site-post-collection activity with extensions', function () {
        var activity = activityMocks.create('livefyre.sitePostCollection');
        var content = activityToContent(activity);
        assert.equal(content.attachments.length, 2);
        assert.equal(content.attachments[0].type, 'photo');
        assert.equal(content.title, activity.object.title);
        assert.instanceOf(content.extensions, Object);
        assert.equal(content.extensions.publisher, 'LA Times');
        assert.typeOf(content.extensions.abstract, 'string');
        assert.equal(content.body, content.extensions.abstract);
    });
    it('throws on invalid site-post-collection activities', function () {
        var invalidActivity = {"cc":["urn:livefyre:demo.fyre.co:site=362588:topic=los_angeles:subscribers"],"verb":"add","object":{"displayName":"Los Angeles","id":"urn:livefyre:demo.fyre.co:site=362588:topic=los_angeles","objectType":"urn:livefyre:entity=topic"},"published":"2014-08-18T21:35:13.203759Z"};
        var content;
        assert.throws(function () {
            content = activityToContent(invalidActivity);
        });
    })
});

describe('collection-feed/activity-feed', function () {
    it('emits error event when invalid activities are .written', function (done) {
        var onErrorSpy = sinon.spy();
        var feed = new ActivityFeed();
        var invalidActivity = {"cc":["urn:livefyre:demo.fyre.co:site=362588:topic=los_angeles:subscribers"],"verb":"add","object":{"displayName":"Los Angeles","id":"urn:livefyre:demo.fyre.co:site=362588:topic=los_angeles","objectType":"urn:livefyre:entity=topic"},"published":"2014-08-18T21:35:13.203759Z"};
        feed.on('error', onErrorSpy);
        // bad one should go through and emit error event
        feed.write(invalidActivity);
        // try a good one after, and it should work
        feed.write(activityMocks.create('livefyre.sitePostCollection'), function (e) {
            assert.notOk(e);
            assert.equal(onErrorSpy.callCount, 1);
            done();
        });
    });
});
