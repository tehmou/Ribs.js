/**
 * @method
 * @desc Toggle a class to the element depending on the boolean
 * value of the associated attribute.<br &><br />
 *
 * Does not observe the changes in the model, so you may have to
 * use invalidateonchange mixin.
 *
 * @param classOptions
 * @param classOptions.className Class to give to the element if
 * the attribute is true.
 * @param classOptions.inverse Give element the class when the
 * attribute is false, and remove it when it is true.
 */
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

