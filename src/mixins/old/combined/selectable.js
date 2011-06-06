Ribs.mixins.selectable = function (classOptions) {
    var SelectableInst = Ribs.mixinParser.createCompositeFromDefinitions([
        { toggleAttribute: {
            attributeName: "selected",
            modelName: "dataUI",
            onEvent: "click",
            offEvent: "click"
        }},
        { toggleableClass: {
            attributeName: "selected",
            modelName: "dataUI",
            className: "selected"
        }}
    ], classOptions);

    return SelectableInst;
};

