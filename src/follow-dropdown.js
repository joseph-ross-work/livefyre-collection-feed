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
    this._innerEl = document.createElement('div');
    this._innerEl.classList.add('lf-follow-dropdown');
}
inherits(Dropdown, View);

Dropdown.prototype._createButton = function () {
    var cmd = new Command(function () {
        console.log('dropdown command', this._popover);
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
        parentEl: this._innerEl
    });
    popover.resizeAndReposition = customPopoverResizeAndReposition;
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
    var span = document.createElement('span');
    this._button.render();
    this._innerEl.appendChild(this._button.el);
    this.el.appendChild(this._innerEl);
};

/** @override */
Dropdown.prototype.destroy = function () {
    View.prototype.destroy.call(this);
    this._popover && this._popover.destroy();
    this._button.destroy();
};

/**
 * A custom version...
 */
function customPopoverResizeAndReposition(elem) {
    // Position popover
    var position = this[Popover.POSITION_FN_MAP[this._position]].call(this, elem);
    var POSITION_PREFIX = Popover.CLASSES.POSITION_PREFIX;
    position.width = this._getPopoverWidth(position.width);
    this.$el.css(position).removeClass(function () {
        var classes = [];
        for (var pos in Popover.POSITIONS) {
            if (Popover.POSITIONS.hasOwnProperty(pos)) {
                classes.push(POSITION_PREFIX + Popover.POSITIONS[pos]);
            }
        }
        return classes.join(' ');
    }).addClass(POSITION_PREFIX + this._activePosition);

    var boundingClientRect = this.el.getBoundingClientRect();
    var windowWidth;
    if (boundingClientRect.left < 0) {
        this.$el.css('left', position.left - boundingClientRect.left+'px');
    } else if (boundingClientRect.right > (windowWidth = window.innerWidth)) {
        // THIS ELSE IF BLOCK IS WHATS ADDED FOR THIS PATCHED VERSION
        // IN COLLECTION-FEED
        this.$el.css('left', position.left - (boundingClientRect.right - windowWidth)+'px');
    }

    // Position popover arrow
    var arrowEl = this.$el.find('.'+Popover.CLASSES.ARROW);
    var popoverParentEl = $(this._parentEl)
    var translateX = arrowEl.offset().left - popoverParentEl.offset().left - (popoverParentEl.outerWidth()/2) ;
    var arrowLeft = parseInt(arrowEl.css('left'), 10);
    arrowEl.css('left', (arrowLeft-translateX)+'px');

    //this._scrollIntoPosition(position.top);
};
