/**
 * @class
 * @desc Pivot mixin that is based on DOM elements. Default
 * pivot used by Ribs, though does not provide model support.
 */
Ribs.mixins.elementPivot = Ribs.mixins.pivot = Ribs.compose(
        "support.element",
        "support.parent",
        "support.renderChain",
        "support.deferredRender",
        "support.parsing",
        "support.methodInherit",
        "support.propertyInherit",
        "support.hideable",
        "support.disposeable",
        "support.duplicating"
    );

