module.exports = ActivityFeed;

var ContentListView = require('streamhub-sdk/content/views/content-list-view');
var inherits = require('inherits');
var activityToContent = require('./activity-to-content');

function ActivityFeed(opts) {
    opts = opts || {};
    ContentListView.call(this, opts);
    if (opts.activities) {
        this._setActivities(opts.activities);
    }
}
inherits(ActivityFeed, ContentListView);

ActivityFeed.prototype.add = function (activity) {
    var content = activityToContent(activity);
    return ContentListView.prototype.add.call(this, content);
};

ActivityFeed.prototype._setActivities = function (activities) {
    var archive = activities.createArchive();
    var updater = activities.createUpdater();
    archive.pipe(this.more);
    updater.pipe(this);
};
