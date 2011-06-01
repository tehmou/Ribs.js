(function () {
    var resolveMixinElement = function (mixin, el) {
        mixin.el = mixin.elementSelector ? el.find(mixin.elementSelector) : el;
    };

    Ribs.mixinBase.mixinElementResolver = {
        redraw: function () {
            if (this.mixins) {
                var el = $(this.el).find(this.elementSelector);
                if (el.length === 0) {
                    el = this.el;
                }
                _.each(this.mixins, _.bind(function (mixin) {
                    resolveMixinElement(mixin, el);
                    if (typeof(mixin.redraw) === "function") {
                        mixin.redraw.apply(mixin, []);
                    }
                }, this));
            }
        }
    };

}());

