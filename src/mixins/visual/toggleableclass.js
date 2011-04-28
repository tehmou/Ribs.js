Ribs.mixins.toggleableClass = function (classOptions) {
    classOptions = classOptions || {};

    var className = classOptions.className || classOptions.attributeName || classOptions.uiAttributeName,
        inverse = classOptions.inverse || false,
    
        ToggleableClass = function () {
            return {
                refresh: function () {
                    var value = this.myValue;
                    if (inverse) {
                        value = !value;
                    }
                    this.el.toggleClass(className, value);
                }
            };
        };

    return ToggleableClass;
};

