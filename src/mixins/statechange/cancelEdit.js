Ribs.mixins.cancelEdit = function (classOptions) {
    var CancelEditInst = function () {
            return _.extend({
                modelName: "data",
                events: {
                    "click": "cancel"
                },
                cancel: function () {
                    this.getMyModel().trigger("ribs:cancelEdit");
                }
            }, classOptions || {});
        };

    return CancelEditInst;
};

