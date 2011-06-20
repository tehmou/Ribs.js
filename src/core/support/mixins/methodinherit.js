Ribs.support.mixins.methodInherit = {
    inheritingMethods: [],

    mixinInitialize: function () {
        this.callAllMixins("mixinInitialize", arguments);
        this.inheritMethods();
    },
    callAllMixins: function (methodName, originalArguments) {
        _.each(this.mixins, function (mixin) {
            if (typeof(mixin[methodName]) === "function") {
                mixin[methodName].apply(mixin, originalArguments);
            }
        });
    },
    inheritMethods: function () {
        var that = this;
        this._inheritedMethods = this._inheritedMethods || [];

        _.each(this.inheritingMethods, function (methodName) {
            if (_.indexOf(that._inheritedMethods, methodName) === -1) {
                var oldMethod = that[methodName];
                that[methodName] = function () {
                    if (typeof(oldMethod) === "function") {
                        oldMethod.apply(this, arguments);
                    }
                    this.callAllMixins(methodName, arguments);
                };
                that._inheritedMethods.push(methodName);
            }
        });
    }
};

