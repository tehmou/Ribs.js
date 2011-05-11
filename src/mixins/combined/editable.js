Ribs.mixins.editable = function (classOptions) {
    var EditableInst = Ribs.mixins.mixinComposite(_.extend({
        mixinClasses: [
            Ribs.mixins.toggleAttribute({
                onEvent: "click",
                offEvent: "click",
                uiAttributeName: "editing"
            }),
            Ribs.mixins.toggleableClass({
                className: "editing",
                uiAttributeName: "editing"
            })
        ]
    }, classOptions || {}));

    return EditableInst;
};

