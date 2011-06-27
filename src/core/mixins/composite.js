/**
 * @class
 */
Ribs.mixins.composite = Ribs.compose(
        "support.parent",
        "support.duplicating",
        "support.methodInherit",
        "support.propertyInherit",
        "support.delegateRendering",
        {
            mixinInitialize: Ribs.utils.functions.resolveChildrenElements,
            redraw: Ribs.utils.functions.resolveChildrenElements
        }
    );

