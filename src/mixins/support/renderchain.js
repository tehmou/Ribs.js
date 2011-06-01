/**
 * @class Creates a more sophisticated component life cycle
 * inside the render function.<br /><br />
 *
 * Ribs.js uses this mixin internally to create views.
**/
Ribs.mixinBase.renderChain = {
    /**
     * @field
     * @desc When calling render(), if this flag is set,
    * a redraw will occur. When redraw is finished, this
     * flag is again reset to false.
     */
    invalidated: true,

    mixinInitialize: function () {
        this.inheritingMethods = this.inheritingMethods.concat([
            "unbindEvents", "bindEvents", "redraw", "refresh", "hide", "dispose"
        ]);
    },
    
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
            this.redraw();
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
     */
    redraw: function () { },

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
     */
    hide: function () { },

    /**
     * @method
     * @desc Destroy the View beyond restoring.
     */
    dispose: function () { }
};