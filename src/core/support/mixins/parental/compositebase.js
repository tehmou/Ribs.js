/**
 * @class
 * @requires Ribs.support.mixins.parent
 */
Ribs.support.mixins.compositeBase = {
    /**
     * @field
     * @desc Array of objects to copy when initializing.
     */
    mixinClasses: null,

    /**
     * @field
     */
    inheritingProperties: [],
    
    mixinInitialize: function () {
        this.mixinClasses = this.mixinClasses || [];
        this.children = [];
        _.each(this.mixinClasses, _.bind(this.createChild, this));
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
        for (var i = 0; i < this.mixinClasses.length; i++) {
            if (this.mixinClasses[i].elementSelector === elementSelector) {
                return this.mixinClasses[i];
            }
        }
        return null;
    }
};

