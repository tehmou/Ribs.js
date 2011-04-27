Ribs.mixins.everyOtherChild = function (classOptions) {
    classOptions = classOptions || {};

    var childClassName = classOptions.childClassName || null,
        EveryOtherChild = function () {
            return {
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
            };
        };

    return EveryOtherChild;
};

