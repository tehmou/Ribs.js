/**
 * @class
 * @desc Pivot mixin that is based on DOM elements. Default
 * pivot used by Ribs, though does not provide model support.
 */
Ribs.export("pivot", [
    "support.bindAllToThis",
    "support.element",
    "support.parent",
    "support.renderChain",
    "support.deferredRender",
    "support.parsing",
    "support.propertyInherit",
    "support.hideable",
    "support.disposeable",
    "support.duplicating",
    "support.methodInherit",
    {
        mixinInitialize: Ribs.mixins.support.functions.resolveChildrenElements
    }
]);
