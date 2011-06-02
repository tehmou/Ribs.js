Ribs.mixinBase.selfParsing = {
    mixinDefinitions: null,
    mixinInitialize: function () {
        this.mixinDefinitions = this.mixinDefinitions || [];
        Ribs.mixinParser.createMixinFromDefinitions({
            mixinDefinitions: this.mixinDefinitions,
            composite: this
        });
    }
};

