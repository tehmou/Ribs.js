Ribs.createMixinDefinitionParser = function (parserOptions) {
    parserOptions = parserOptions || {};

    var parser = { },
        mixinLibrary = parserOptions.mixinLibrary || {};

    parser.createCompositeFromDefinitions = function (options) {
        options = options || {};

        if (!mixinLibrary.hasOwnProperty("composite")) {
            Ribs.throwError("noCompositeMixinFoundForParsing");
        }

        var composite = options.composite || _.clone(mixinLibrary.composite),
            mixinDefinitions = options.mixinDefinitions || [];
            mixinClasses = options.mixinClasses || [];

        if (_.isArray(mixinDefinitions)) {
            var parseOne = function (value, key) {
                if (!mixinLibrary[key]) {
                    Ribs.throwError("mixinTypeNotFound", key);
                }
                mixinClasses.push(_.extend({}, mixinLibrary[key], value));
            };
            for (var i = 0; i < mixinDefinitions.length; i++) {
                _.each(mixinDefinitions[i], parseOne);
            }
        } else {
            var _createMixinFromDefinitions = function (nestedMixinDefinitions, elementSelector) {
                mixinClasses.push(parser.createCompositeFromDefinitions({
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

