/**
 * @class
 * @desc Pivot mixin that is based on DOM elements. Default
 * pivot used by Ribs, though does not provide model support.
 */
Ribs.exportMixin("support.pivot", [
    "support.bindAllToThis",
    "support.dom.element",
    "support.parent",
    "support.rendering.renderChain",
    "support.rendering.deferredRender",
    "support.parsing",
    "support.propertyInherit",
    "support.dom.hideable",
    "support.dom.disposeable",
    "support.duplicating",
    "support.methodInherit",
    {
        mixinInitialize: Ribs.mixins.support.functions.resolveChildrenElements
    }
]);
