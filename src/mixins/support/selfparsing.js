Ribs.mixinBase.selfparsing = {
    mixinDefinitions: [],
    mixinInitialize: function () {
        Ribs.mixinParser.createMixinFromDefinitions({
            mixinDefinitions: this.mixinDefinitions,
            composite: this
        });
    }
};