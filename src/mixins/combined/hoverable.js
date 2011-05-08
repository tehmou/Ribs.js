Ribs.mixins.hoverable = function (classOptions) {
    classOptions = classOptions || {};
    
    var HoverableInst = Ribs.mixins.mixinComposite(_.extend(classOptions, {
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
    }));

    Ribs.readMixinOptions(HoverableInst, classOptions);
    return HoverableInst;
};

