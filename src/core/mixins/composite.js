/**
 * @class
 */
Ribs.mixins.composite = Ribs.compose(
        "support.parent",
        "support.childrenElementResolver",
        "support.duplicating",
        "support.methodInherit",
        "support.propertyInherit",
        "support.delegateRendering",
        {
            mixinInitialize: function () {
                this.resolveChildMixinElements();
            },
            redraw: function () {
                this.resolveChildMixinElements();
            }
        }
    );

