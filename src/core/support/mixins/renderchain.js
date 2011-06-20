/**
 * @class Creates a more sophisticated component life cycle
 * inside the render function.
 * @requires Ribs.support.mixins.methodInherit
**/
Ribs.support.mixins.renderChain = {
    /**
     * @field
     * @desc When calling render(), if this flag is set,
     * a redraw will occur. When redraw is finished, this
     * flag is again reset to false.
     * @default true
     */
    invalidated: true,

    /**
     * @field
     * @desc This flag should be set to true externally
     * when the component has finished initializing.
     * @default false
     */
    initialized: false,

    /**
     * @field
     * @default ["unbindEvents", "bindEvents", "redraw", "refresh", "hide", "dispose"]
     */
    inheritingMethods: ["unbindEvents", "bindEvents", "redraw", "refresh", "hide", "dispose"],

    /**
     * @method
     * @desc Override to Backbone.View.render.<br /><br />
     *
     * Exits if initialized flag is not set.<br /><br />
     *
     * Maintains the View life cycle of rendering. If invalidated
     * flag is set, unbinds all DOM events, calls redraw, and then
     * binds the events. After this comes always refresh,
     * regardless of the invalidated flag.
     */
    render: function () {
        if (!this.initialized) { return; }
        if (this.invalidated) {
            this.unbindEvents();
            this.redraw();
            this.bindEvents();
            this.invalidated = false;
        }
        this.refresh();
    },

    /**
     * @method
     * @desc Clear all listeners to DOM events. This is an empty
     * function by default.
     */
    unbindEvents: function () { },

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


