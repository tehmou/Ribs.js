Ribs.ManagedView = Backbone.View.extend({
    invalidated: true,
    refreshOnlyIfVisible: false,

    initialize: function () {
        _.bindAll(this, "customInitialize", "bindToModel", "modelChanged", "render", "redraw", "refresh", "hide", "dispose");
        Backbone.View.prototype.initialize.apply(this, arguments);
        this.model && this.bindToModel(this.model);
        this.customInitialize();
        this.render();
    },
    customInitialize: function () { },
    bindToModel: function (model) {
        this.model && this.model.ribsUI && this.model.ribsUI.safeUnbind("all", this.render);
        this.model = model;
        this.model && Ribs.augmentModelWithUIAttributes(this.model);
        this.modelChanged();
        this.model && this.model.ribsUI.bind("all", this.render);
        this.invalidated = true;
    },
    modelChanged: function () { },
    render: function () {
        if (this.invalidated) {
            this.redraw();
            this.invalidated = false;
        }
        $(this.el).unbind();
        if (!this.refreshOnlyIfVisible || $(this.el).is(":visible")) {
            this.refresh();
        }
    },
    redraw: function () { },
    refresh: function () {
    },
    hide: function () {
        $(this.el).detach();
    },
    dispose: function () {
        $(this.el).remove();
    }
});

