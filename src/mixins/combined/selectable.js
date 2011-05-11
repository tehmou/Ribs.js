Ribs.mixins.selectable = function (classOptions) {
    var SelectableInst = Ribs.mixins.mixinComposite(_.extend({
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
    }, classOptions || {}));

    return SelectableInst;
};

