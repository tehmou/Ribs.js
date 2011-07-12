/**
 * @class
 * @requires Ribs.mixins.support.dom.element
 */
Ribs.mixins.support.hideable = {
    inheritingMethods: ["hide"],
    
    /**
     * @method
     * @desc Calls $(this.el).detach();
     */
    hide: function () {
        $(this.el).detach();
    }
};

