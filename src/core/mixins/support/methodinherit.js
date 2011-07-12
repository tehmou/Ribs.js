/**
 * @class
 * @requires Ribs.mixins.support.parent
 */
Ribs.mixins.support.methodInherit = {
    inheritingMethods: [],

    mixinInitialize: function () {
        this.inheritMethods();
        this.delegateToChildren("mixinInitialize", arguments);
    },
    inheritMethods: function () {
        var that = this;
        this._inheritedMethods = this._inheritedMethods || [];

        _.each(this.inheritingMethods, function (methodName) {
            if (_.indexOf(that._inheritedMethods, methodName) === -1) {
                var oldMethod = that[methodName];
                that[methodName] = function () {
                    if (_.isFunction(oldMethod)) {
                        oldMethod.apply(this, arguments);
                    }
                    this.delegateToChildren(methodName, arguments);
                };
                that._inheritedMethods.push(methodName);
            }
        });
    }
};

