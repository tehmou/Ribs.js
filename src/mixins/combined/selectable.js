Ribs.mixins.selectable = function (classOptions) {
    classOptions = classOptions || {};
    var Selectable = Ribs.mixins.mixinComposite(_.extend(classOptions, {
        mixinClasses: [
            Ribs.mixins.toggleAttribute({
                onEvent: "click",
                offEvent: "click",
                uiAttributeName: "selected"
            }),
            Ribs.mixins.toggleableClass({
                className: "selected",
                uiAttributeName: "selected"
            })
        ]
    }));

    return Selectable;
};

