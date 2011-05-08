Ribs.mixins.selectable = function (classOptions) {
    classOptions = classOptions || {};
    
    var SelectableInst = Ribs.mixins.mixinComposite(_.extend(classOptions, {
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

    Ribs.readMixinOptions(SelectableInst, classOptions);
    return SelectableInst;
};

