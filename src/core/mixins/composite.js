/**
 * @class
 */
Ribs.exportMixin("composite", [
    "support.parent",
    "support.duplicating",
    "support.methodInherit",
    "support.propertyInherit",
    "support.rendering.delegateRendering",
    {
        mixinInitialize: Ribs.mixins.support.functions.resolveChildrenElements,
        redraw: Ribs.mixins.support.functions.resolveChildrenElements
    }
]);
