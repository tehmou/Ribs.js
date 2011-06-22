/**
 * @class
 * @requires Ribs.support.mixins.parent
 */
Ribs.support.mixins.methodInherit = {
    inheritingMethods: [],
    inheritingProperties: ["inheritingMethods"],

    mixinInitialize: function () {
        this.delegateToChildren("mixinInitialize", arguments);
        this.inheritMethods();
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
                    this.delegateToChildren(methodName, arguments);
                };
                that._inheritedMethods.push(methodName);
            }
        });
    }
};

