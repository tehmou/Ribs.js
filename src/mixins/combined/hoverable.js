Ribs.mixins.hoverable = function (classOptions) {
    var HoverableInst = Ribs.mixins.mixinComposite(_.extend({
        mixinClasses: [
            Ribs.mixins.toggleAttribute({
                onEvent: "mouseenter",
                offEvent: "mouseleave",
                uiAttributeName: "hovering"
            }),
            Ribs.mixins.toggleableClass({
                className: "hovering",
                uiAttributeName: "hovering"
            })
        ]
    }, classOptions || {}));

    return HoverableInst;
};

