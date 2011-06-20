/**
 * @class
 * @desc Default behavior for renderChain with a DOM element.
 * @requires Ribs.mixins.support.element
 * @requires Ribs.mixins.support.renderChain
 */
Ribs.mixins.support.defaultElementRenderChain = {
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

