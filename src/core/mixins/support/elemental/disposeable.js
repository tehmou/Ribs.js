/**
 * @class
 * @requires Ribs.mixins.support.element
 */
Ribs.mixins.support.disposeable = {
    inheritingMethods: ["dispose"],

    /**
     * @method
     * @desc Calls $(this.el).remove();
     */
    dispose: function () {
        $(this.el).remove();
    }
};

