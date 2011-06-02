Ribs.mixins.hoverable = function (classOptions) {
    var HoverableInst = Ribs.mixinParser.createCompositeFromDefinitions([
        { toggleAttribute: {
            attributeName: "hovering",
            modelName: "dataUI",
            onEvent: "mouseenter",
            offEvent: "mouseleave"
        }},
        { toggleableClass: {
            attributeName: "hovering",
            modelName: "dataUI",
            className: "hovering"
        }}
    ], classOptions);

    return HoverableInst;
};

