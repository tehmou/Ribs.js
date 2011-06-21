/**
 * @class
 */
Ribs.backbone.mixins.pivot = Ribs.utils.compose(
    Ribs.mixins.plainPivot,
    Ribs.backbone.support.mixins.modelSupport,
    Ribs.backbone.support.mixins.invalidating,
    {
        mixinInitialize: function () {
            this.initialized = true;
        }
    }
);

