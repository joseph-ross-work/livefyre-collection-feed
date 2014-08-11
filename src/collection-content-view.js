module.exports = CollectionContentView;

var BaseContentView = require('./base-content-view');
var FeedContentViewFactory = require('streamhub-feed/content-view-factory');
var feedContentViewFactory = new FeedContentViewFactory({
    contentTypeView: BaseContentView
});
var CompositeView = require('view/composite-view');
var TagsHeaderView = require('./tags-header-view');

/**
 * Create a streamhub-feed content view
 */
function createFeedContentView (content) {
    return feedContentViewFactory.createContentView(content);
}

function CollectionContentView(content) {
    var contentView = createFeedContentView(content);
    var tagsHeader = new TagsHeaderView(content.tags);
    contentView.render = (function (ogRender) {
        return function () {
            var ret = ogRender.apply(this, arguments);
            renderTagsHeader.call(this, tagsHeader);
            return ret;
        }
    }(contentView.render));
    return contentView;
}

function renderTagsHeader(tagsHeaderView) {
    // only add once
    if (this.$el.has(tagsHeaderView.$el).length) {
        return;
    }
    tagsHeaderView.render();
    this.$el.prepend(tagsHeaderView.$el);
}
