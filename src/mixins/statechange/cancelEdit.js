Ribs.mixins.cancelEdit = function (classOptions) {
    var CancelEditInst = function () {
            return _.extend({
                events: {
                    "click": "cancel"
                },
                cancel: function () {
                    this.uiModel.trigger("cancelEdit");
                    this.uiModel.set({ editing: false });
                }
            }, classOptions || {});
        };

    return CancelEditInst;
};

