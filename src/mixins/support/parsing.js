Ribs.mixinBase.parsing = {
    mixinDefinitions: [],
    mixinInitialize: function () {
        Ribs.mixinParser.createMixinFromDefinitions({
            mixinDefinitions: this.mixinDefinitions,
            composite: this
        });
    }
};