/**
 * @class
 * @requires Ribs.mixins.support.parent
 */
Ribs.mixins.support.compositeBase = {
    mixinClasses: null,
    
    mixinInitialize: function () {
        this.mixinClasses = this.mixinClasses || [];
        this.children = [];
        _.each(this.mixinClasses, _.bind(this.createMixin, this));
    },
    createMixin: function (mixinDef) {
        var mixin = _.extend({}, this, mixinDef);
        _.bind(function () { _.bindAll(this); }, mixin)();
        this.children.push(mixin);
    },
    findMixinWithElementSelector: function (elementSelector) {
        for (var i = 0; i < this.mixinClasses.length; i++) {
            if (this.mixinClasses[i].elementSelector === elementSelector) {
                return this.mixinClasses[i];
            }
        }
        return null;
    }
};

