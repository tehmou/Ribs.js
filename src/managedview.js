/**
 * @augments Backbone.View
 * @class A more sophisticated Backbone.View that adds
 * support for component lifecycles, as often needed
 * in RIA applications.
**/
Ribs.ManagedView = Backbone.View.extend(
/** @lends Ribs.ManagedView */
{

    /**
     * @field
     * @desc When calling render(), if this flag is set,
     * a redraw will occur. When redraw is finished, this
     * flag is again reset to false.
     */
    invalidated: true,
    
    /**
     * @field
     * @desc Is set when the component has finished initializing
     * and is ready to be rendered.
     */
    initialized: false,

    /**
     * @method
     * @desc Override to Backbone.View.initialize; Is called on
     * creation, using the "new" operator.
     */
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

    /**
     * @method
     * @desc Is called after the "real" initialize is completed,
     * apart from setting initialized flag and rendering. Without
     * the initialized flag the component will not render.<br /><br />
     *
     * This is a clean place for generic initialization code.
     * A call to this method is not expected of an overriding method.
     */
    customInitialize: function () { },
    
    /**
     * @method
     * @desc Backbone convention for setting/changing the model
     * for a View. Here is it is defined explicitly since the View
     * life cycle requires it. A possible old model is unbound of
     * its change handler, and the new one is in turn bound.<br /><br />
     *
     * If the new model does not yet augmented with UI attributes,
     * Ribs.augmentModelWithUIAttributes does this.
     *
     * @param model The Backbone.Model we want this View to represent.
     */
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
    
    /**
     * @method
     * @desc Override to Backbone.View.render.<br /><br />
     *
     * Exits if initialized flag is not set.<br /><br />
     *
     * Maintains the View life cycle of rendering. First
     * unbinds all events, then redraws if invalidated flag
     * is set, and after that calls refresh and binds all events.
     */
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

    /**
     * @method
     * @desc Clear all listeners to DOM events. The default
     * implementation only calls $(this.el).unbind().
     */
    unbindEvents: function () {
        $(this.el).unbind();
    },

    /**
     * @method
     * @desc Set all listeners to DOM events. This is an empty
     * function by default.
     */
    bindEvents: function () { },

    /**
     * @method
     * @desc Do all expensive DOM operations that could break
     * listeners (hiding etc.). This is an empty
     * function by default.
     *
     * @param el Receives the el of this View as
     * a parameter (needed by mixins).
     */
    redraw: function (el) { },

    /**
     * @method
     * @desc Set styles, calculates values, etc. This is called
     * each time the View is rendered, so don't do anything expensive
     * here. This is an empty function by default.
     */
    refresh: function () { },

    /**
     * @method
     * @desc Remove from DOM with the prospect of reattaching.
     * Default behavior calls $(this.el).detach();
     */
    hide: function () {
        $(this.el).detach();
    },

    /**
     * @method
     * @desc Destroy the View beyond restoring. $By default,
     * $(this.el).remove(); is called.
     */
    dispose: function () {
        $(this.el).remove();
    }

});

