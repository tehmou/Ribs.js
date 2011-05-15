Ribs.mixins.selectable = function (classOptions) {
    var SelectableInst = Ribs.mixinParser.createMixinFromDefinitions([
        { toggleAttribute: {
            onEvent: "click",
            offEvent: "click"
        }},
        { toggleableClass: {
            className: "selected"
        }}
    ], _.extend({
        attributeName: "selected",
        modelName: "dataUI"
    }, classOptions));

    return SelectableInst;
};

