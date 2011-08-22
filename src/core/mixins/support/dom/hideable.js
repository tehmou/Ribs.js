/**
 * @class
 * @requires Ribs.mixins.support.dom.element
 */
Ribs.mixins.support.dom.hideable = {
    inheritingMethods: ["hide"],
    
    /**
     * @method
     * @desc Calls $(this.el).detach();
     */
    hide: function () {
        $(this.el).detach();
    }
};

