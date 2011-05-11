Ribs.mixins.everyOtherChild = function (classOptions) {
    var EveryOtherChildInst = function () {
            return _.extend({
                childClassName: null,
                refresh: function () {
                    if (!this.childClassName) {
                        return;
                    }
                    var odd = false;
                    this.el.children().each(function (index, child) {
                        $(child).toggleClass(this.childClassName, odd);
                        odd = !odd;
                    });
                }
            }, classOptions || {});
        };

    return EveryOtherChildInst;
};

