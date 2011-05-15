Ribs.mixins.openable = function (classOptions) {
    var OpenableInst = Ribs.mixinParser.createMixinFromDefinitions([
        { toggleAttribute: {
            onEvent: "click",
            offEvent: "click"
        }},
        { toggleableClass: {
            className: "open"
        }}
    ], _.extend({
        attributeName: "open",
        modelName: "dataUI"
    }));

    return OpenableInst;
};

