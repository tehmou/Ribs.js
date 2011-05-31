Ribs.mixins.openable = function (classOptions) {
    var OpenableInst = Ribs.mixinParser.createMixinFromDefinitions([
        { toggleAttribute: {
            attributeName: "open",
            modelName: "dataUI",
            onEvent: "click",
            offEvent: "click"
        }},
        { toggleableClass: {
            attributeName: "open",
            modelName: "dataUI",
            className: "open"
        }}
    ], classOptions);

    return OpenableInst;
};

