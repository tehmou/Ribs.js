Ribs.ManagedView = Backbone.View.extend({
    invalidated: true,
    refreshOnlyIfVisible: false,

    initialize: function () {
        _.bindAll(this, "customInitialize", "bindToModel", "modelChanged", "render", "unbindEvents", "redraw", "refresh", "bindEvents", "hide", "dispose");
        Backbone.View.prototype.initialize.apply(this, arguments);
        this.model && this.bindToModel(this.model);
        this.customInitialize();
        this.render();
    },
    customInitialize: function () { },
    bindToModel: function (model) {
        this.modelChanging();
        this.model && this.model.ribsUI && this.model.ribsUI.safeUnbind("all", this.render);
        this.model = model;
        this.model && Ribs.augmentModelWithUIAttributes(this.model);
        this.model && this.model.ribsUI.bind("all", this.render);
        this.invalidated = true;
        this.modelChanged(model);
    },
    modelChanging: function () { },
    modelChanged: function (newModel) { },
    render: function () {
        this.unbindEvents();
        if (this.invalidated) {
            this.redraw(this.el);
            this.invalidated = false;
        }
        if (!this.refreshOnlyIfVisible || $(this.el).is(":visible")) {
            this.refresh();
        }
        this.bindEvents();
    },
    unbindEvents: function () {
        $(this.el).unbind();
    },
    bindEvents: function () { },
    redraw: function (el) { },
    refresh: function () { },
    hide: function () {
        $(this.el).detach();
    },
    dispose: function () {
        $(this.el).remove();
    }
});

