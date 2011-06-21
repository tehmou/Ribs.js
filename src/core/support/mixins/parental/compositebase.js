/**
 * @class
 * @requires Ribs.support.mixins.parent
 */
Ribs.support.mixins.compositeBase = {
    /**
     * @field
     * @desc Array of objects to copy when initializing.
     */
    childrenTypes: null,

    /**
     * @field
     */
    inheritingProperties: [],
    
    mixinInitialize: function () {
        this.childrenTypes = this.childrenTypes || [];
        this.children = [];
        _.each(this.childrenTypes, _.bind(this.createChild, this));
    },
    createChild: function (mixinDef) {
        var that = this,
            mixin = _.extend({}, mixinDef);
        _.each(this.inheritingProperties, function (value) {
            mixin[value] = that[value];
        });
        _.bind(function () { _.bindAll(this); }, mixin)();
        this.children.push(mixin);
    },
    findChildWithElementSelector: function (elementSelector) {
        for (var i = 0; i < this.childrenTypes.length; i++) {
            if (this.childrenTypes[i].elementSelector === elementSelector) {
                return this.childrenTypes[i];
            }
        }
        return null;
    }
};

