/**
 * @class
 * @requires Ribs.mixins.support.parent
 */
Ribs.mixins.support.parsing = {
    mixinDefinitions: null,

    mixinInitialize: function () {
        Ribs.mixinParser.createCompositeFromDefinitions({
                composite: this,
                mixinDefinitions: this.mixinDefinitions || []
            });
    }
};

