/**
 * @class
 */
Ribs.mixins.plainPivot = Ribs.utils.addingExtend({},
        Ribs.support.mixins.renderChain,
        Ribs.support.mixins.defaultElementRenderChain,
        Ribs.support.mixins.deferredRender,
        Ribs.support.mixins.selfParsing,
        Ribs.support.mixins.element,
        Ribs.mixins.composite
    );

