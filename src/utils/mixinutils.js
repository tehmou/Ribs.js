Ribs.parseOneMixinDefinition = function (options, name) {
    var mixinFunction = Ribs.mixins[name];
    if (!mixinFunction) {
        throw "Could not find mixin " + name;
    }
    return mixinFunction(options);
};

Ribs.parseMixinDefinitions = function (mixinDefinitions) {
    mixinDefinitions = mixinDefinitions || [];
    var mixinClasses = [], i, l;

    if (_.isArray(mixinDefinitions)) {
        for (i = 0, l = mixinDefinitions.length; i < l; i++) {
            var mixinDefinitionObject = mixinDefinitions[i];
            _.each(mixinDefinitionObject, function () {
                var mixin = Ribs.parseOneMixinDefinition.apply(this, arguments);
                mixinClasses.push(mixin);
            });
        }
    } else {
        _.each(mixinDefinitions,
            function (nestedMixinDefinitionArray, elementSelector) {
                var MixinComposite = Ribs.mixins.mixinComposite({
                    mixins: nestedMixinDefinitionArray,
                    elementSelector: elementSelector
                });
                mixinClasses.push(MixinComposite);
            }
        );
    }
    return mixinClasses;
};

