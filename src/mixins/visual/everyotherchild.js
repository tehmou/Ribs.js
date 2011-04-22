Ribs.mixins.everyOtherChild = function (classOptions) {
    classOptions = classOptions || {};

    var childClassName = classOptions.childClassName || null,
        EveryOtherChild = function (instanceOptions) {
            return _.extend(new Ribs.MixinBase(classOptions, instanceOptions), {
                refresh: function () {
                    if (!childClassName) {
                        return;
                    }
                    var odd = false;
                    this.el.children().each(function (index, child) {
                        $(child).toggleClass(childClassName, odd);
                        odd = !odd;
                    });
                }
            });
        };

    return EveryOtherChild;
};

