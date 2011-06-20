/**
 * @class
 */
Ribs.mixins.plain = Ribs.mixins.support.eventful;

/**
 * @class
 */
Ribs.mixins.composite = Ribs.utils.addingExtend({},
        Ribs.mixins.support.methodInherit,
        Ribs.mixins.support.compositeBase,
        Ribs.mixins.support.childrenElementResolver
    );

/**
 * @class
 */
Ribs.mixins.templated = Ribs.utils.addingExtend({},
        { redraw: Ribs.utils.resolveJSON },
        { redraw: Ribs.utils.resolveValue },
        Ribs.mixins.support.templated
    );

