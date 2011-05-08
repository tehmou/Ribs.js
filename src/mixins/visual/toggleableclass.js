Ribs.mixins.toggleableClass = function (classOptions) {
    classOptions = classOptions || {};

    var className = classOptions.className || classOptions.attributeName || classOptions.uiAttributeName,
        inverse = classOptions.inverse || false,
    
        ToggleableClassInst = function () {
            return {
                attributeName: classOptions.attributeName,
                uiAttributeName: classOptions.uiAttributeName,
                elementSelector: classOptions.elementSelector,
                refresh: function () {
                    var value = this.myValue;
                    if (inverse) {
                        value = !value;
                    }
                    if (this.el.hasClass(className) !== value) {
                        this.el.toggleClass(className, value);
                    }
                }
            };
        };

    return ToggleableClassInst;
};

