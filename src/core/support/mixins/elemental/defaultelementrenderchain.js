/**
 * @class
 * @desc Default behavior for renderChain with a DOM element.
 * @requires Ribs.support.mixins.element
 * @requires Ribs.support.mixins.renderChain
 */
Ribs.support.mixins.defaultElementRenderChain = {
    /**
     * @method
     * @desc Calls $(this.el).detach();
     */
    hide: function () {
        $(this.el).detach();
    },

    /**
     * @method
     * @desc Calls $(this.el).remove();
     */
    dispose: function () {
        $(this.el).remove();
    }
};

