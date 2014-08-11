var $ = require('streamhub-sdk/jquery');
var inherits = require('inherits');
var ContentView = require('streamhub-sdk/content/views/content-view');
var ContentHeaderView = require('streamhub-sdk/content/views/content-header-view');
var ContentBodyView = require('streamhub-sdk/content/views/content-body-view');
var ContentFooterView = require('streamhub-sdk/content/views/content-footer-view');
var TiledAttachmentListView = require('streamhub-sdk/content/views/tiled-attachment-list-view');
var BlockAttachmentListView = require('streamhub-sdk/content/views/block-attachment-list-view');
var feedContentStyles = require('less!streamhub-feed/css/style.less');
var hasTheme = require('streamhub-sdk/content/views/mixins/theme-mixin');
var contentBodyTemplate = require('hgn!./templates/collection-content-body');

'use strict';

var CollectionFeedContentView = function (opts) {
    opts = opts || {};
    hasTheme(this, 'content-feed');
    ContentView.call(this, opts);
};
inherits(CollectionFeedContentView, ContentView);

CollectionFeedContentView.prototype._addInitialChildViews = function (opts) {
    opts = opts || {};

    this._tiledAttachmentListView = new TiledAttachmentListView(opts);
    this.add(this._tiledAttachmentListView, { render: false });

    this._headerView = opts.headerView || this._headerViewFactory.createHeaderView(opts.content);
    this.add(this._headerView, { render: false });

    this._blockAttachmentListView = new BlockAttachmentListView(opts);
    this.add(this._blockAttachmentListView, { render: false });

    this._bodyView = new ContentBodyView(opts);
    // use custom template that linkifies titles if content.url
    this._bodyView.template = contentBodyTemplate;
    this.add(this._bodyView, { render: false });

    this._footerView = new ContentFooterView(opts);
    this.add(this._footerView, { render: false });
};

module.exports = CollectionFeedContentView;
