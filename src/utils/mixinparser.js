Ribs.createMixinDefinitionParser = function (parseOne) {
    var parser = { };

    parser.parseOne = parseOne;
    parser.createMixinFromDefinitions = function (mixinDefinitions, elementSelector) {
        mixinDefinitions = mixinDefinitions || [];
        var mixinClasses = [], i, l;

        if (_.isArray(mixinDefinitions)) {
            for (i = 0, l = mixinDefinitions.length; i < l; i++) {
                var mixinDefinitionObject = mixinDefinitions[i];

                if (typeof(mixinDefinitionObject) === "function") {
                    mixinClasses.push(mixinDefinitionObject);
                } else {
                    _.each(mixinDefinitionObject, function (options, name) {
                        var MixinClass = parser.parseOne.apply(this, [options, name]);
                        mixinClasses.push(MixinClass);
                    });
                }
            }
        } else {
            _.each(mixinDefinitions, function (nestedMixinDefinitions, elementSelector) {
                var MixinClass = parser.createMixinFromDefinitions(nestedMixinDefinitions, elementSelector);
                mixinClasses.push(MixinClass);
            });
        }
        MixinComposite = Ribs.mixins.mixinComposite({
            mixinsClasses: mixinClasses,
            elementSelector: elementSelector
        });
        return MixinComposite;
    };

    return parser;
};

Ribs.createMixinResolver = function (mixinLibrary) {
    return function (options, name) {
        if (name === "inline") {
            return function () { return options };
        }
        var mixinFunction = mixinLibrary[name];
        if (!mixinFunction) {
            throw "Could not find mixin " + name;
        }
        return mixinFunction(options);
    }
};

Ribs.mixinParser = Ribs.createMixinDefinitionParser(Ribs.createMixinResolver(Ribs.mixins));

