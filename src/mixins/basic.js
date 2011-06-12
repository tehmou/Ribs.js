Ribs.mixins.plain = Ribs.mixinBase.eventful;
Ribs.mixins.plainWithModel = Ribs.addingExtend({},
        Ribs.mixins.plain,
        Ribs.mixinBase.modelful
    );
Ribs.mixins.composite = Ribs.addingExtend({},
        Ribs.mixinBase.compositeBase,
        Ribs.mixinBase.childMixinElementResolver
    );

