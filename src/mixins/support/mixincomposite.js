Ribs.mixins.mixinComposite = function (classOptions) {
    classOptions = classOptions || {};
    var mixinClasses = classOptions.mixinClasses || [];

    if (classOptions.mixinClasses) {
        delete classOptions.mixinClasses;
    }

    var MixinComposite = function (instanceOptions) {
            instanceOptions = instanceOptions || {};
            var mixinOptions = _.extend(classOptions, instanceOptions);
            this.mixins = [];
            _.each(mixinClasses, _.bind(function (MixinClass) {
                var mixin = new MixinClass(mixinOptions);
                this.mixins.push(mixin);
            }, this));
        };

    _.each(Ribs.mixinMethods, function (methodName) {
        MixinComposite.prototype[methodName] = function () {
            var originalArguments = arguments;
            _.each(this.mixins, function (mixin) {
                if (mixin[methodName]) {
                    mixin[methodName].apply(mixin, originalArguments);
                }
            });
        }
    });

    return MixinComposite;
};