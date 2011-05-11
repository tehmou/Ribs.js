Ribs.mixins.openable = function (classOptions) {
    var OpenableInst = Ribs.mixins.mixinComposite(_.extend({
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
    }, classOptions || {}));

    return OpenableInst;
};

