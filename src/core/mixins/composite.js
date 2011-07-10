/**
 * @class
 */
Ribs.export("composite", [
    "support.parent",
    "support.duplicating",
    "support.methodInherit",
    "support.propertyInherit",
    "support.delegateRendering",
    {
        mixinInitialize: Ribs.mixins.support.functions.resolveChildrenElements,
        redraw: Ribs.mixins.support.functions.resolveChildrenElements
    }
]);
