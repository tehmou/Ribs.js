/**
 * @method
 * @param parserOptions
 */
Ribs.utils.createMixinDefinitionParser = function (parserOptions) {
    parserOptions = parserOptions || {};

    var parser = { },
        mixinLibrary = parserOptions.mixinLibrary || {};

    parser.parseMixin = function (name, mixinOptions) {
        try {
            var mixin = _.extend({},
                    Ribs.utils.findObject(mixinLibrary, name),
                    mixinOptions, { _type: name }
                );
        } catch (e) {
            Ribs.throwError("mixinTypeNotFound", name);
        }
        return mixin;
    };

    parser.createCompositeFromDefinitions = function (options) {
        options = options || {};

        if (!mixinLibrary.hasOwnProperty("composite")) {
            Ribs.throwError("noCompositeMixinFoundForParsing");
        }

        var composite = options.composite || parser.parseMixin("composite"),
            mixinDefinitions = options.mixinDefinitions || [],
            childrenTypes = options.childrenTypes || [];

        composite.elementSelector = options.elementSelector;

        if (_.isArray(mixinDefinitions)) {
            var parseOne = function (value, key) {
                childrenTypes.push(parser.parseMixin(key, value));
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
Ribs.mixinParser = Ribs.utils.createMixinDefinitionParser({ mixinLibrary: Ribs.mixins });

