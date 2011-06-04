Ribs.mixinBase.composite = {
    inheritingMethods: null,
    mixinClasses: null,
    mixinInitialize: function () {
        this.inheritingMethods = this.inheritingMethods || [];
        this.mixinClasses = this.mixinClasses || [];
        this.mixins = [];
        _.each(this.mixinClasses, _.bind(function (mixinType) {
            var mixin = _.extend({}, mixinType, {
                inheritingMethods: this.inheritingMethods,
                pivot: this.pivot
            });
            _.bind(function () { _.bindAll(this); }, mixin)();
            this.mixins.push(mixin);
        }, this));
        this.callAllMixins("mixinInitialize", arguments);
        this.initializeInheritingMethods(this);
    },
    callAllMixins: function (methodName, originalArguments) {
        _.each(this.mixins, function (mixin) {
            if (typeof(mixin[methodName]) === "function") {
                mixin[methodName].apply(mixin, originalArguments);
            }
        });
    },
    initializeInheritingMethods: function () {
        _.each(this.inheritingMethods, _.bind(function (methodName) {
            var oldMethod = this[methodName];
            this[methodName] = function () {
                if (typeof(oldMethod) === "function") {
                    oldMethod.apply(this, arguments);
                }
                this.callAllMixins(methodName, arguments);
            };
        }, this));
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

