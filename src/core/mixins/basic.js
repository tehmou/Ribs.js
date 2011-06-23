/**
 * @class
 */
Ribs.mixins.plain = Ribs.support.mixins.eventful;

/**
 * @class
 */
Ribs.mixins.composite = Ribs.utils.compose(
        Ribs.support.mixins.parent,
        Ribs.support.mixins.methodInherit,
        Ribs.support.mixins.duplicating,
        Ribs.support.mixins.childrenElementResolver
    );

/**
 * @class
 */
Ribs.mixins.templated = Ribs.utils.compose(
        { redraw: Ribs.support.functions.resolveJSON },
        { redraw: Ribs.support.functions.resolveValue },
        Ribs.support.mixins.templated
    );

