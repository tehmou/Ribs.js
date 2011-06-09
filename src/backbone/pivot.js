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

Ribs.backbone.backbonePivot = _.extend(
    {},
    Ribs.mixins.plainPivot,
    Ribs.backbone.modelSupport,
    Ribs.backbone.invalidating,
    {
        mixinInitialize: function () {
            Ribs.mixins.plainPivot.mixinInitialize.apply(this, arguments);
            Ribs.backbone.modelSupport.mixinInitialize.apply(this, arguments);
            Ribs.backbone.invalidating.mixinInitialize.apply(this, arguments);
            this.initialized = true;
        }
    }
);

