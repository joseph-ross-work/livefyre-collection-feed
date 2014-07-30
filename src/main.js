module.exports = activityToContent;

var Content = require('streamhub-sdk/content');
var Collection = require('streamhub-sdk/collection');

/**
 * Transform an AS Activity to a
 * streamhub-sdk/content instance
 */
function activityToContent(activity) {
    var content = new Content();
    content.set({
        title: activity.object.title,
        url: activity.object.url,
        collection: collectionFromActivity(activity)
    });
    return content;
}

function collectionFromActivity(activity) {
    var collectionOpts = collectionOptsFromUrn(activity.object.id);
    collectionOpts.articleId = activity.object.articleId;
    var collection = new Collection(collectionOpts);
    collection.url = activity.object.url;
    return collection;
}

/**
 * Given a URN of a Livefyre Collection, return an object with that collection's
 * network, siteId, and collection id
 * @example
 * collectionOptsFromUrn('urn:livefyre:livefyre.com:site=286470:collection=824379')
 */
var collectionUrnPattern = /urn:livefyre:([^:]+):site=([^:]+):collection=([^:]+)/i;
function collectionOptsFromUrn(urn) {
    var match = urn.match(collectionUrnPattern);
    if ( ! match) {
        throw new Error("Invalid collection URN: "+urn);
    }
    return {
        network: match[1],
        siteId: match[2],
        id: match[3]
    }
}
