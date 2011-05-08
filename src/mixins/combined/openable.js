Ribs.mixins.openable = function (classOptions) {
    classOptions = classOptions || {};
    var OpenableInst = Ribs.mixins.mixinComposite(_.extend(classOptions, {
        mixinClasses: [
            Ribs.mixins.toggleAttribute({
                onEvent: "click",
                offEvent: "click",
                uiAttributeName: "open"
            }),
            Ribs.mixins.toggleableClass({
                className: "open",
                uiAttributeName: "open"
            })
        ]
    }));

    return OpenableInst;
};

