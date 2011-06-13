Ribs.mixins.plain = Ribs.support.mixins.eventful;
Ribs.mixins.plainWithModel = Ribs.addingExtend({},
        Ribs.mixins.plain,
        Ribs.support.mixins.modelful
    );
Ribs.mixins.composite = Ribs.addingExtend({},
        Ribs.support.mixins.compositeBase,
        Ribs.support.mixins.childMixinElementResolver
    );
Ribs.mixins.templated = Ribs.addingExtend({},
        { redraw: Ribs.support.functions.resolveJSON },
        { redraw: Ribs.support.functions.resolveValue },
        Ribs.support.mixins.templated
    );

