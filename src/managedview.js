// A more sophisticated Backbone.View that adds
// support for component lifecycles, as often needed
// in RIA applications.
//
// Ribs.js uses the model ribsUIModels to store
// an arbitrary number of models that the View renders.
// The default ones are:
//
// data:        The default Backbone property model.
// dataUI:      A model added to the data model with
//              Ribs.augmentModelWithUIProperties.
// internal:    UI model that only this View uses internally.
//

Ribs.ManagedView = Backbone.View.extend({
    invalidated: true,

    initialize: function () {
        _.bindAll(this, "customInitialize", "bindToModel", "render", "unbindEvents", "redraw", "refresh", "bindEvents", "hide", "dispose");
        this.ribsUIModels = new Backbone.Model({ internal: new Backbone.Model() });
        this.ribsUIModels.set(this.options.ribsUIModels);
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
        if (this.model && this.model.ribsUI) {
            this.model.ribsUI.unbind("change", this.render);
        }
        this.model = model;
        if (this.model) {
            Ribs.augmentModelWithUIAttributes(this.model);
            this.model.ribsUI.bind("change", this.render);
        }
        this.ribsUIModels.set({
            data: model,
            dataUI: model.ribsUI
        });
        this.invalidated = true;
    },
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

