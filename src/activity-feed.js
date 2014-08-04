module.exports = ActivityFeed;

var ContentListView = require('streamhub-sdk/content/views/content-list-view');
var inherits = require('inherits');
var activityToContent = require('./activity-to-content');
var packageAttribute = require('./package-attribute');
require('css!streamhub-sdk/css/style.css');

function ActivityFeed(opts) {
    opts = opts || {};
    ContentListView.call(this, opts);
    packageAttribute.decorateModal(this.modal);
    if (opts.activities) {
        this._setActivities(opts.activities);
    }
}
inherits(ActivityFeed, ContentListView);

ActivityFeed.prototype.add = function (activity) {
    var content = activityToContent(activity);
    return ContentListView.prototype.add.call(this, content);
};

ActivityFeed.prototype.createContentView = function (content) {
    var contentView = ContentListView.prototype.createContentView.apply(this, arguments);
    contentView.render = (function (ogRender) {
        return function () {
            var ret = ogRender.apply(this, arguments);
            debugger;
            renderTags.call(this);
            return ret;
        };
    }(contentView.render));
    function renderTags() {
        debugger;
        var contentView = this;
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
    return contentView;
};

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
