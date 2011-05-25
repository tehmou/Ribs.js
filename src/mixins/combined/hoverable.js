/**
 * @method
 * @desc Binds to mouseenter and mouseleave to know when
 * the user is hovering over the element of this mixin.
 * Toggles the "hovering" property of the UI model and
 * assigns class "hovering" to the element, if the user
 * is hovering.
 *
 * @param classOptions
 * @param classOptions.elementSelector This is the only
 * property that has any effect.
 */
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

