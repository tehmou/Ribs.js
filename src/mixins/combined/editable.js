Ribs.mixins.editable = function (classOptions) {
    var EditableInst = Ribs.mixinParser.createMixinFromDefinitions([
        { toggleAttribute: {
            onEvent: "click",
            offEvent: "click"
        }},
        { toggleableClass: {
            className: "editing"
        }}
    ], _.extend({
        attributeName: "editing",
        modelName: "dataUI"
    }, classOptions));

    return EditableInst;
};

