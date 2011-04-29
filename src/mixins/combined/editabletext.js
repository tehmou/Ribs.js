Ribs.mixins.editableText = function (classOptions) {
    Ribs.log("Editable");
    var EditableText = Ribs.mixins.mixinComposite(_.extend(classOptions, {
        mixins: [
            { mixinComposite: {
                elementCreator: "<span>moi</span>",
                mixins: [
                    { toggleableElement: { uiAttributeName: "editing", inverse: true } }
                ]
            }},
            { mixinComposite: {
                elementCreator: "<input type=\"text\" />",
                mixins: [
                    { toggleableElement: { uiAttributeName: "editing" } },
                    { textValueEdit: {
                        attributeName: classOptions.attributeName,
                        uiAttributeName: classOptions.uiAttributeName
                    }}
                ]
            }}
        ]
    }));

    return EditableText;
};

