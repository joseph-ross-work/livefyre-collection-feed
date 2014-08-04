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
        displayName: extensions ? extensions.publisher || extensions.source : undefined
    }
    content.set(contentPropsFromActivity(activity));
    if (extensions) {
        extendContent(content, extensions);
    }
    return content;
}

function extendContent(content, extensions) {
    var props = {};
    var author = content.author || {};
    if ( ! extensions) {
        return content;
    }
    // publisher is author
    if (extensions.publisher) {
        author.displayName = extensions.publisher;
    }
    props.author = author;
    // attachments
    attachmentsFromExtensions(extensions).forEach(function (a) {
        content.addAttachment(a);
    });
    // abstract
    props.body = extensions.abstract || extensions.summary || '';
    content.set(props);
    return content;
}

function attachmentsFromExtensions(extensions) {
    var attachments = [];
    var attachmentUrl = extensions.attachment || extensions.image;
    if (attachmentUrl) {
        attachments.push({
            "version": "1.0",
            "type": "photo",
            "url": attachmentUrl
        })
    }
    if (extensions.image_url) {
        var _attachment = attachmentFromImage_Extensions(extensions);
        if (_attachment) attachments.push(_attachment);
    }
    return attachments;
}

function attachmentFromImage_Extensions(extensions) {
    var oembed = {
        version: '1.0',
        type: 'photo',
        url: extensions.image_url,
        height: extensions.image_height,
        width: extensions.image_width
    }
    return oembed;
}

/**
 * Return an object of the extensions to a
 * collection
 */
function collectionExtensions(collection) {
    var links = collection && collection.links;
    if ( ! links) {
        return {};
    }
    var extensions = collection.links
        .filter(function (link) {
            return link.rel === 'extension';
        })
        .map(function (link) {
            return link.object;
        })
        .reduce(function (prev, next) {
            Object.keys(next).forEach(function (key) {
                prev[key] = next[key];
            });
            return prev;
        }, {});
    return extensions;
}

function contentPropsFromActivity(activity) {
    return {
        id: activity.published || activity.tuuid,
        title: activity.object.title,
        url: activity.object.url,
        collection: collectionFromActivity(activity),
        extensions: collectionExtensions(activity.object),
        createdAt: new Date(Date.parse(activity.published)),
        tags: activity.object.tags
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
