Ribs.mixins.editable = function (classOptions) {
    classOptions = classOptions || {};
    var Editable = Ribs.mixins.mixinComposite(_.extend(classOptions, {
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
    }));

    return Editable;
};

