Ribs.support.mixins.compositeBase = {
    mixinClasses: null,
    
    mixinInitialize: function () {
        this.mixinClasses = this.mixinClasses || [];
        this.mixins = [];
        _.each(this.mixinClasses, _.bind(this.createMixin, this));
    },
    createMixin: function (mixinDef) {
        var mixin = _.extend({}, this, mixinDef);
        _.bind(function () { _.bindAll(this); }, mixin)();
        this.mixins.push(mixin);
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

