(function () {

    var callAllMixins = function (mixins, methodName, originalArguments) {
            _.each(mixins, function (mixin) {
                if (typeof(mixin[methodName]) === "function") {
                    mixin[methodName].apply(mixin, originalArguments);
                }
            });
        },
        updateMixinEl = function (mixin, el) {
            mixin.el = mixin.elementSelector ? el.find(mixin.elementSelector) : el;
        };

    Ribs.mixins.mixinComposite = function (classOptions) {
        classOptions = classOptions || {};

        var MixinCompositeInst = function (parentView, model) {
                this.customInitialize = function () {
                    if (parentView) {
                        parentView.bind("change", this.updateMixinModels);
                    }
                    this.mixins = [];
                    _.each(this.mixinClasses, _.bind(function (MixinClass) {
                        var mixin = new MixinClass(parentView, model), that = this;
                        _.bind(function () { _.bindAll(this); }, mixin)();
                        mixin.parent = parentView;
                        this.mixins.push(mixin);
                    }, this));
                    this.updateMixinModel();
                    callAllMixins(this.mixins, "customInitialize", arguments);
                };

                this.bindToModel = function () {
                    this.updateMixinModel();
                };

                this.redraw = function (parentEl) {
                    this.el = $(parentEl).find(this.elementSelector);
                    if (this.el.length === 0) {
                        if (this.elementCreator) {
                            this.el = $(parentEl).append($(this.elementCreator));
                        } else {
                            this.el = $(parentEl);
                        }
                    }
                    _.each(this.mixins, _.bind(function (mixin) {
                        updateMixinEl(mixin, this.el);
                        if (mixin.redraw) {
                            mixin.redraw.apply(mixin, [mixin.el]);
                        }
                    }, this));
                };

                _.extend(this, classOptions);
            };

        MixinCompositeInst.prototype.mixinClasses = classOptions.mixinClasses;

        _.each(Ribs.mixinMethods, function (methodName) {
            if (!MixinCompositeInst.prototype.hasOwnProperty(methodName)) {
                MixinCompositeInst.prototype[methodName] = function () {
                    callAllMixins(this.mixins, methodName, arguments);
                };
            }
        });

        return MixinCompositeInst;
    };
}());

