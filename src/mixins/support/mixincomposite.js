Ribs.mixins.mixinComposite = function (classOptions) {
    classOptions = classOptions || {};
    mixinClasses = classOptions.mixinClasses;

    var mixins = [],
        MixinComposite = function (instanceOptions) {
            _.each(mixinClasses, function (MixinClass) {
                var mixin = new MixinClass(instanceOptions);
                mixins.push(mixin);
            });
        };

    _.each(Ribs.mixinMethods, function (methodName) {
        MixinComposite.prototype[methodName] = function () {
            var originalArguments = arguments;
            _.each(mixins, function (mixin) {
                if (mixin[methodName]) {
                    mixin[methodName].apply(mixin, originalArguments);
                }
            });
        }
    });

    return MixinComposite;
};