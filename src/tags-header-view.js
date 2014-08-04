module.exports = TagsHeaderView;

var View = require('view');
var inherits = require('inherits');

function TagsHeaderView(tags) {
    View.apply(this, arguments);
    this.tags = tags;
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
