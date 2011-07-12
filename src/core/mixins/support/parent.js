/**
 * @class
 */
Ribs.mixins.support.parent = {
    /**
     * @field
     * @default Empty array.
     */
    children: [],
    
    delegateToChildren: function (methodName, originalArguments) {
        _.each(this.children, function (mixin) {
            if (typeof(mixin[methodName]) === "function") {
                mixin[methodName].apply(mixin, originalArguments);
            }
        });
    }
};

