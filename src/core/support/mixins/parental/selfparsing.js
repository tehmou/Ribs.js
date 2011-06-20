/**
 * @class
 * @requires Ribs.support.mixins.parent
 */
Ribs.support.mixins.selfParsing = {
    mixinDefinitions: null,
    
    mixinInitialize: function () {
        this.mixinDefinitions = this.mixinDefinitions || [];
        Ribs.mixinParser.createCompositeFromDefinitions({
            mixinDefinitions: this.mixinDefinitions,
            composite: this
        });
    }
};

