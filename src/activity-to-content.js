module.exports = activityToContent;

var Content = require('streamhub-sdk/content');
var LivefyreContent = require('streamhub-sdk/content/types/livefyre-content');
var Collection = require('streamhub-sdk/collection');

/**
 * Transform an AS Activity to a
 * streamhub-sdk/content instance
 */
function activityToContent(activity) {
    var content = new LivefyreContent('');
    var extensions = collectionExtensions(activity.object);
    content.author = {
        displayName: extensions.publisher
    }
    content.set(contentPropsFromActivity(activity));
    attachmentsFromActivity(activity).forEach(function (a) {
        content.addAttachment(a);
    });
    return content;
}

function attachmentsFromActivity(activity) {
    var attachmentUrl = collectionExtensions(activity.object).attachment
    var oembed = {
        "version": "1.0",
        "type": "photo",
        "url": attachmentUrl
    };
    return [oembed];
}

/**
 * Return an object of the extensions to a
 * collection
 */
function collectionExtensions(collection) {
    var extensions = collection.links
        .filter(function (link) {
            return link.rel === 'extension';
        })
        .map(function (link) {
            return link.object;
        })[0];
    return extensions;
}

function contentPropsFromActivity(activity) {
    return {
        id: activity.published || activity.tuuid,
        title: activity.object.title,
        url: activity.object.url,
        collection: collectionFromActivity(activity),
        extensions: collectionExtensions(activity.object)
    };
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
