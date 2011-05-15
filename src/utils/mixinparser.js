Ribs.createMixinDefinitionParser = function (parseOne) {
    var parser = { };

    parser.parseOne = parseOne;

    parser.createMixinFromDefinitions = function (mixinDefinitions, elementSelector) {
        mixinDefinitions = mixinDefinitions || [];
        var mixinClasses = [], i, l,
            _parseOne = function (options, name) {
                var MixinClass = parser.parseOne.apply(this, [options, name]);
                mixinClasses.push(MixinClass);
            },
            _createMixinFromDefinitions = function (nestedMixinDefinitions, elementSelector) {
                var MixinClass = parser.createMixinFromDefinitions(nestedMixinDefinitions, elementSelector);
                mixinClasses.push(MixinClass);
            };

        if (_.isArray(mixinDefinitions)) {
            for (i = 0, l = mixinDefinitions.length; i < l; i++) {
                var mixinDefinitionObject = mixinDefinitions[i];

                if (typeof(mixinDefinitionObject) === "function") {
                    mixinClasses.push(mixinDefinitionObject);
                } else {
                    _.each(mixinDefinitionObject, _parseOne);
                }
            }
        } else {
            _.each(mixinDefinitions, _createMixinFromDefinitions);
        }

        return Ribs.mixins.mixinComposite({
            mixinClasses: mixinClasses,
            elementSelector: elementSelector
        });
    };

    return parser;
};

Ribs.createMixinResolver = function (mixinLibrary) {
    return function (options, name) {
        if (name === "inline") {
            return function () { return options; };
        }
        var mixinFunction = mixinLibrary[name];
        if (!mixinFunction) {
            throw "Could not find mixin " + name;
        }
        return mixinFunction(options);
    };
};

Ribs.mixinParser = Ribs.createMixinDefinitionParser(Ribs.createMixinResolver(Ribs.mixins));

