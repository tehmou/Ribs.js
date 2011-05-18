Ribs.mixins.hoverable = function (classOptions) {
    var HoverableInst = Ribs.mixinParser.createMixinFromDefinitions([
        { toggleAttribute: {
            onEvent: "mouseenter",
            offEvent: "mouseleave"
        }},
        { toggleableClass: {
            className: "hovering"
        }}
    ], _.extend({
        attributeName: "hovering",
        modelName: "dataUI"
    }, classOptions));

    return HoverableInst;
};

