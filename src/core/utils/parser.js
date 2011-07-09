/**
 * @method
 * @param parserOptions
 */
Ribs.utils.createMixinDefinitionParser = function (parserOptions) {
    parserOptions = parserOptions || {};

    var parser = { },
        parseFunction = parserOptions.parseFunction;

    parser.createCompositeFromDefinitions = function (options) {
        options = options || {};

        var composite = options.composite || parseFunction("composite"),
            mixinDefinitions = options.mixinDefinitions || [],
            childrenTypes = options.childrenTypes || [];

        composite.elementSelector = options.elementSelector;

        if (_.isArray(mixinDefinitions)) {
            var parseOne = function (value, key) {
                childrenTypes.push(parseFunction(key, value));
            };
            for (var i = 0; i < mixinDefinitions.length; i++) {
                _.each(mixinDefinitions[i], parseOne);
            }
        } else {
            var _createMixinFromDefinitions = function (nestedMixinDefinitions, elementSelector) {
                var mixin = parser.createCompositeFromDefinitions({
                    mixinDefinitions: nestedMixinDefinitions,
                    elementSelector: elementSelector
                });
                childrenTypes.push(mixin);
            };
            _.each(mixinDefinitions, _createMixinFromDefinitions);
        }
        composite.childrenTypes = childrenTypes;
        return composite;
    };

    return parser;
};

/**
 * @field
 */
Ribs.mixinParser = Ribs.utils.createMixinDefinitionParser({ parseFunction: Ribs.compose });

/**
 * @method
 */
Ribs.parse = Ribs.mixinParser.createCompositeFromDefinitions;

