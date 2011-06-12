Ribs.backbone.augmentModelWithUIAttributes = function (model) {
    if (!model.hasOwnProperty("ribsUI")) {
        model.ribsUI = new Backbone.Model();
        model.ribsUI.set({ owner: model });
        model.ribsUI.bind("all", function (event) {
            var ev = "ribsUI:" + event;
            model.trigger(ev, Array.prototype.slice.call(arguments, 1));
        });
    }
};

Ribs.backbone.backbonePivot = Ribs.addingExtend({},
    Ribs.mixins.plainPivot,
    Ribs.backbone.modelSupport,
    Ribs.backbone.invalidating,
    {
        mixinInitialize: function () {
            this.initialized = true;
        }
    }
);

