Ribs.ManagedView = Backbone.View.extend({
    invalidated: true,

    initialize: function () {
        _.bindAll(this, "customInitialize", "bindToModel", "modelChanging", "modelChanged", "render", "unbindEvents", "redraw", "refresh", "bindEvents", "hide", "dispose");
        Backbone.View.prototype.initialize.apply(this, arguments);
        if (this.model) {
            this.bindToModel(this.model);
        }
        this.customInitialize();
        this.initialized = true;
        this.render();
    },
    customInitialize: function () { },
    bindToModel: function (model) {
        this.modelChanging();
        if (this.model && this.model.ribsUI) {
             this.model.ribsUI.safeUnbind("all", this.render);
        }
        this.model = model;
        if (this.model) {
            Ribs.augmentModelWithUIAttributes(this.model);
            this.model.ribsUI.bind("all", this.render);
        }
        this.invalidated = true;
        this.modelChanged(model);
    },
    modelChanging: function () { },
    modelChanged: function (newModel) { },
    render: function () {
        if (!this.initialized) { return; }
        this.unbindEvents();
        if (this.invalidated) {
            this.redraw(this.el);
            this.invalidated = false;
        }
        this.refresh();
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

