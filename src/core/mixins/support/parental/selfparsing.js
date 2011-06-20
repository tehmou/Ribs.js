/**
 * @class
 * @requires Ribs.mixins.support.parent
 */
Ribs.mixins.support.selfParsing = {
    mixinDefinitions: null,
    
    mixinInitialize: function () {
        this.mixinDefinitions = this.mixinDefinitions || [];
        Ribs.mixinParser.createCompositeFromDefinitions({
            mixinDefinitions: this.mixinDefinitions,
            composite: this
        });
    }
};

