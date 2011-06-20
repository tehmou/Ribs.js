/**
 * @class
 * @requires Ribs.mixins.support.parent
 * @requires Ribs.mixins.support.element
 * @requires Ribs.mixins.support.renderChain
 */
Ribs.mixins.support.childrenElementResolver = {
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
                mixin.el = mixin.elementSelector ? el.find(mixin.elementSelector) : el;
            });
        }
    }
};

