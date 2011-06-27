/**
 * @class
 * @requires Ribs.mixins.support.parent
 * @requires Ribs.mixins.support.element
 */
Ribs.utils.functions.resolveChildrenElements = function () {
    if (this.children && this.el) {
        var el = $(this.elementSelector, this.el);
        if (el.length === 0) {
            el = this.el;
        }
        _.each(this.children, function (mixin) {
            mixin.el = mixin.elementSelector ? $(mixin.elementSelector, el) : el;
        });
    }
};

