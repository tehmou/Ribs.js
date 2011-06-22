/**
 * @class
 */
Ribs.support.mixins.parent = {
    children: null,
    
    delegateToChildren: function (methodName, originalArguments) {
        _.each(this.children, function (mixin) {
            if (typeof(mixin[methodName]) === "function") {
                mixin[methodName].apply(mixin, originalArguments);
            }
        });
    }
};