Ribs.mixins.everyOtherChild = function (classOptions) {
    classOptions = classOptions || {};

    var childClassName = classOptions.childClassName || null,
    
        EveryOtherChildInst = function () {
            return {
                attributeName: classOptions.attributeName,
                uiAttributeName: classOptions.uiAttributeName,
                elementSelector: classOptions.elementSelector,
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

    return EveryOtherChildInst;
};

