Ribs.support.mixins.childMixinElementResolver = {
    mixinInitialize: function () {
        this.resolveChildMixinElements();
    },
    redraw: function () {
        this.resolveChildMixinElements();
    },
    resolveChildMixinElements: function () {
        if (this.mixins && this.el) {
            var el = $(this.el).find(this.elementSelector);
            if (el.length === 0) {
                el = this.el;
            }
            _.each(this.mixins, function (mixin) {
                mixin.el = mixin.elementSelector ? el.find(mixin.elementSelector) : el;
            });
        }
    }
};

