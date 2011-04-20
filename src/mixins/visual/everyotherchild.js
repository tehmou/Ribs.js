Ribs.mixins.everyOtherChild = function (myOptions) {
    myOptions = myOptions || {};

    var childClassName = myOptions.childClassName || null,
        EveryOtherChild = function () {
            return _.extend(new Ribs.mixins.MixinBase(myOptions),
            {
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

