/**
 * @class
 * @requires Ribs.support.mixins.parent
 * @requires Ribs.support.mixins.element
 * @requires Ribs.support.mixins.renderChain
 */
Ribs.support.mixins.childrenElementResolver = {
    mixinInitialize: function () {
        this.resolveChildMixinElements();
    },
    redraw: function () {
        this.resolveChildMixinElements();
    },
    resolveChildMixinElements: function () {
        if (this.children && this.el) {
            var el = $(this.el).find(this.elementSelector);
            if (el.length === 0) {
                el = this.el;
            }
            _.each(this.children, function (mixin) {
                mixin.el = mixin.elementSelector ? $(el).find(mixin.elementSelector) : el;
            });
        }
    }
};

