/**
 * @class
 * @requires Ribs.support.mixins.parent
 */
Ribs.support.mixins.selfParsing = {
    mixinDefinitions: null,

    mixinInitialize: function () {
        var content = Ribs.mixinParser.createCompositeFromDefinitions({
                mixinDefinitions: this.mixinDefinitions || []
        });
        content.mixinInitialize();
        this.children = [content];
    }
};

