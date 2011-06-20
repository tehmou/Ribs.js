/**
 * @class
 */
Ribs.mixins.plainPivot = Ribs.utils.addingExtend({},
        Ribs.mixins.support.renderChain,
        Ribs.mixins.support.defaultElementRenderChain,
        Ribs.mixins.support.deferredRender,
        Ribs.mixins.support.selfParsing,
        Ribs.mixins.support.element,
        Ribs.mixins.composite
    );

