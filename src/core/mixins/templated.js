/**
 * @class
 */
Ribs.mixins.templated = Ribs.compose(
        { redraw: Ribs.utils.functions.resolveJSON },
        { redraw: Ribs.utils.functions.resolveValue },
        "support.templated"
    );

