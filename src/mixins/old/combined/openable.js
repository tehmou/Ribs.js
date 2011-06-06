Ribs.mixins.openable = function (classOptions) {
    var OpenableInst = Ribs.mixinParser.createCompositeFromDefinitions([
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

