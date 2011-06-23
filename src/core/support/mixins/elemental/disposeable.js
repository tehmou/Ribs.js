/**
 * @class
 * @requires Ribs.support.mixins.element
 */
Ribs.support.mixins.disposeable = {
    inheritingMethods: ["dispose"],

    /**
     * @method
     * @desc Calls $(this.el).remove();
     */
    dispose: function () {
        $(this.el).remove();
    }
};

