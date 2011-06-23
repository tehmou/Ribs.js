/**
 * @class
 * @requires Ribs.support.mixins.element
 */
Ribs.support.mixins.hideable = {
    inheritingMethods: ["hide"],
    
    /**
     * @method
     * @desc Calls $(this.el).detach();
     */
    hide: function () {
        $(this.el).detach();
    }
};

