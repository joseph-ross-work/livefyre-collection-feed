module.exports = ActivityFeed;

var ContentListView = require('streamhub-sdk/content/views/content-list-view');
var inherits = require('inherits');
var activityToContent = require('./activity-to-content');
var packageAttribute = require('./package-attribute');
var FeedContentViewFactory = require('streamhub-feed/content-view-factory');

// collection-feed specific styles
require('less!collection-feed/styles/styles.less');

function ActivityFeed(opts) {
    opts = opts || {};
    ContentListView.call(this, opts);
    this._contentViewFactory = new FeedContentViewFactory();
    packageAttribute.decorateModal(this.modal);
    if (opts.activities) {
        this._setActivities(opts.activities);
    }
}
inherits(ActivityFeed, ContentListView);

ActivityFeed.prototype.elClass += ' lf-collection-feed';

ActivityFeed.prototype.add = function (activity) {
    var content = activityToContent(activity);
    return ContentListView.prototype.add.call(this, content);
};

ActivityFeed.prototype.createContentView = function (content) {
    var contentView = this._contentViewFactory.createContentView(content);
    // var contentView = ContentListView.prototype.createContentView.apply(this, arguments);
    contentView.render = (function (ogRender) {
        return function () {
            var ret = ogRender.apply(this, arguments);
            renderTags.call(this);
            return ret;
        };
    }(contentView.render));
    return contentView;
};

/**
 * Call on a ContentView to render tags
 */
function renderTags() {
    var contentView = this;
    var content = contentView.content;
    var $body = contentView.$('.content-body');
    var tagsEl = document.createElement('div');
    tagsEl.classList.add('content-tags');
    (content.tags || [])
        .map(renderTag)
        .forEach(function (el) {
            tagsEl.appendChild(el);
        });
    $body.prepend(tagsEl);
}

// render a tag object to an HTMLElement
function renderTag(tag) {
    var tagEl = document.createTextNode(tag.displayName + '     ');
    return tagEl;
}

ActivityFeed.prototype._setActivities = function (activities) {
    var archive = activities.createArchive();
    var updater = activities.createUpdater();
    archive.pipe(this.more);
    updater.pipe(this);
};

ActivityFeed.prototype.setElement = function (el) {
    if ( this.el) {
        packageAttribute.undecorate(this.el);
    }
    var ret = ContentListView.prototype.setElement.apply(this, arguments);
    packageAttribute.decorate(this.el);
    return ret;
};
