/**
 * @class
 * @requires Ribs.mixins.support.parent
 * @requires Ribs.mixins.support.propertyInherit
 */
Ribs.mixins.support.duplicating = {
    /**
     * @field
     * @desc Array of objects to copy when initializing.
     */
    childrenTypes: [],
    
    mixinInitialize: function () {
        this.duplicate();
        this.giveHeritageToChildren();
    },
    duplicate: function () {
        this.children = [];
        _.each(this.childrenTypes, _.bind(this.createChild, this));
    },
    createChild: function (childType) {
        var that = this,
            mixin = _.extend({}, childType);
        _.bind(function () { _.bindAll(this); }, mixin)();
        this.children.push(mixin);
    }
};

