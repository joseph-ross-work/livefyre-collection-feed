module.exports = ActivityFeed;

var ContentListView = require('streamhub-sdk/content/views/content-list-view');
var inherits = require('inherits');
var activityToContent = require('./activity-to-content');

function ActivityFeed(opts) {
    ContentListView.call(this, opts);
}
inherits(ActivityFeed, ContentListView);

ActivityFeed.prototype.add = function (activity) {
    var content = activityToContent(activity);
    return ContentListView.prototype.add.call(this, content);
};
