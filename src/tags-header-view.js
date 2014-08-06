module.exports = TagsHeaderView;

var View = require('view');
var inherits = require('inherits');
var FollowButtonDropdown = require('./follow-dropdown');
var FollowButtonFactory = require('./follow-button-factory');

function TagsHeaderView(tags) {
    View.apply(this, arguments);
    this.tags = tags;
    var followButtonFactory = new FollowButtonFactory();
    function createDropdown(tags) {
        var dropdown = new FollowButtonDropdown({
            followButton: function () {
                var el = followButtonFactory.create.apply(followButtonFactory, arguments);
                return el;
            },
            tags: tags
        });
        dropdown.render();
        dropdown.$el.addClass('lf-tags-header-view-follow')
        dropdown._button.$el.addClass('lf-btn-primary lf-btn-xs');
        return dropdown.el;
    }
    this._dropdown = createDropdown(tags);
};
inherits(TagsHeaderView, View);

TagsHeaderView.prototype.elClass += 'lf-tags-header-view';

TagsHeaderView.prototype.render = function () {
    var tags = this.tags;
    var tagsArray = tags instanceof Array ? tags : undefined;
    var hasTags = tagsArray && tagsArray.length;
    if ( ! hasTags) {
        return;
    }
    this.el.appendChild(renderTags(tagsArray));
    this.el.appendChild(this._dropdown);
};

/**
 * Call on a ContentView to render tags
 */
function renderTags(tags) {
    var tagsEl = document.createElement('span');
    tagsEl.classList.add('content-tags');
    (tags || [])
        .map(renderTag)
        .forEach(function (el) {
            tagsEl.appendChild(el);
        });
    return tagsEl;
}

// render a tag object to an HTMLElement
function renderTag(tag) {
    var tagEl = document.createElement('span');
    tagEl.classList.add('lf-label');
    tagEl.classList.add('lf-label-info');
    tagEl.classList.add('lf-label-md');
    tagEl.appendChild(document.createTextNode(tag.displayName));
    return tagEl;
}
