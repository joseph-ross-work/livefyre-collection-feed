module.exports = Dropdown;

var inherits = require('inherits');
var packageAttribute = require('./package-attribute');
var Button = require('streamhub-ui/button');
var Command = require('streamhub-ui/command');
var Popover = require('streamhub-ui/popover');
var View = require('view');
var $ = require('jquery');

/**
 * Dropdown encapulates a clickable element and a popover.
 * @param {function} opts.followButton
 * @param {Object.<string, string>} opts.tags
 */
function Dropdown(opts) {
    View.apply(this, arguments);
    this._button = this._createButton();
    this._popover = null;
}
inherits(Dropdown, View);

Dropdown.prototype._createButton = function () {
    var cmd = new Command(function () {
        if (!this._popover) {
            this._popover = this._createPopover();
        }
    }.bind(this));

    return new Button(cmd, {
        className: 'drop-btn',
        label: 'Follow <span class="caret"></span>'
    });
};

Dropdown.prototype._createPopover = function () {
    var self = this;
    var popover = new Popover({
        parentEl: this.el
    });
    var $el = $('<ul />');
    this.opts.tags.forEach(function (tag) {
        var li = $('<li>' + tag.displayName + '</li>');
        li.append(this.opts.followButton(tag.id));
        $el.append(li);
    }.bind(this));

    popover._position = 'bottom';
    popover.render();
    popover.setContentNode($el[0]);
    popover.resizeAndReposition(this._button.el);
    popover.show(this._button.$el[0]);

    setTimeout(function () {
        $('body').on('click', hideShare);
    }, 100);

    function hideShare(ev) {
        if ($(ev.target).closest(popover.el).length) {
            return;
        }
        popover.destroy();
        self._popover = popover = null;
        $('body').off('click', hideShare);
    }

    return popover;
};

Dropdown.prototype.elClass = 'lf-drop';

/** @override */
Dropdown.prototype.setElement = function () {
    if (this.el) {
        packageAttribute.undecorate(this.el);
    }
    var ret = View.prototype.setElement.apply(this, arguments);
    packageAttribute.decorate(this.el);
    return ret;
};

/** @override */
Dropdown.prototype.render = function() {
    View.prototype.render.call(this);
    this._button.render();
    this.$el.append(this._button.$el);
};

/** @override */
Dropdown.prototype.destroy = function () {
    View.prototype.destroy.call(this);
    this._popover && this._popover.destroy();
    this._button.destroy();
};
