module.exports = ActivityFeed;

var ContentListView = require('streamhub-sdk/content/views/content-list-view');
var inherits = require('inherits');
var activityToContent = require('./activity-to-content');
var packageAttribute = require('./package-attribute');
var sdkStyle = require('css!streamhub-sdk/css/style.css');
var createCollectionContentView = require('./collection-content-view');

// collection-feed specific styles
require('less!collection-feed/styles/styles.less');

function ActivityFeed(opts) {
    opts = opts || {};
    ContentListView.call(this, opts);
    packageAttribute.decorateModal(this.modal);
    if (opts.activities) {
        this._setActivities(opts.activities);
    }
}
inherits(ActivityFeed, ContentListView);

ActivityFeed.prototype.elClass += ' lf-collection-feed';

ActivityFeed.prototype._write = function (chunk, done) {
    console.log('AF._write', arguments);
    try {
        ContentListView.prototype._write.apply(this, arguments);
    } catch (e) {
        done(e);
        return;
    }
}

ActivityFeed.prototype.add = function (activity) {
    var content;
    try {
        content = activityToContent(activity);        
    } catch (e) {
        console.error("ActivityFeed: Error creating content from activity. Skipping");
        // return;
        throw e;
    }
    return ContentListView.prototype.add.call(this, content);
};

ActivityFeed.prototype.createContentView = function (content) {
    return createCollectionContentView(content);
};

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
