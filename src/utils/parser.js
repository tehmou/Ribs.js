Ribs.createMixinDefinitionParser = function (parserOptions) {
    parserOptions = parserOptions || {};

    var parser = { },
        mixinLibrary = parserOptions.mixinLibrary || {};

    parser.createMixinFromDefinitions = function (options) {
        options = options || {};

        var composite = options.composite || _.clone(Ribs.mixins.composite),
            mixinDefinitions = options.mixinDefinitions || [];
            mixinClasses = options.mixinClasses || [];

        if (_.isArray(mixinDefinitions)) {
            var parseOne = function (value, key) {
                if (!mixinLibrary[key]) {
                    throw "Could not find mixin by type " + key;
                }
                mixinClasses.push(_.extend({}, mixinLibrary[key], value));
            };
            for (var i = 0; i < mixinDefinitions.length; i++) {
                _.each(mixinDefinitions[i], parseOne);
            }
        } else {
            var _createMixinFromDefinitions = function (nestedMixinDefinitions, elementSelector) {
                mixinClasses.push(parser.createMixinFromDefinitions({
                    mixinDefinitions: nestedMixinDefinitions,
                    elementSelector: elementSelector
                }));
            };
            _.each(mixinDefinitions, _createMixinFromDefinitions);
        }

        composite.mixinClasses = mixinClasses;
        return composite;
    };

    return parser;
};

Ribs.mixinParser = Ribs.createMixinDefinitionParser(Ribs.mixins);

