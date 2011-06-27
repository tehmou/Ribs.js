/**
 * @class Creates a more sophisticated component life cycle
 * inside the render function.
 * @requires Ribs.mixins.support.initializing
 * @requires Ribs.mixins.support.parent
 */
Ribs.mixins.support.renderChain = {
    /**
     * @field
     * @desc When calling render(), if this flag is set,
     * a redraw will occur. When redraw is finished, this
     * flag is again reset to false.
     * @default true
     */
    invalidated: true,

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
            this.delegateToChildren("unbindEvents");
            this.delegateToChildren("redraw");
        }
        this.delegateToChildren("render");
        if (this.invalidated) {
            this.delegateToChildren("bindEvents");
            this.invalidated = false;
        }
    }
};

