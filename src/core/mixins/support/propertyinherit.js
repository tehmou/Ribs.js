/**
 * @class
 * @requires Ribs.mixins.support.parent
 */
Ribs.mixins.support.propertyInherit = {
    /**
     * @field
     * @default Empty array.
     */
    inheritingProperties: [],

    giveHeritageToChildren: function () {
        var that = this;
        _.each(that.children, function (child) {
            _.each(that.inheritingProperties, function (key) {
                child[key] = child[key] || that[key];
            });
        });
    }
};

