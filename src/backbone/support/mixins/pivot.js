Ribs.backbone.backbonePivot = Ribs.utils.addingExtend({},
    Ribs.mixins.plainPivot,
    Ribs.backbone.support.modelSupport,
    Ribs.backbone.support.invalidating,
    {
        mixinInitialize: function () {
            this.initialized = true;
        }
    }
);

