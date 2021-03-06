Ribs.mixins.toggleableClass = function (classOptions) {
    classOptions = classOptions || {};
    var ToggleableClassInst = function () {
            return _.extend({
                className: classOptions.attributeName || classOptions.uiAttributeName,
                inverse: false,
                refresh: function () {
                    var value = this.myValue;
                    if (this.inverse) {
                        value = !value;
                    }
                    if (this.el.hasClass(this.className) !== value) {
                        this.el.toggleClass(this.className, value);
                    }
                }
            }, classOptions || {});
        };

    return ToggleableClassInst;
};

