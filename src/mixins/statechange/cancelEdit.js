Ribs.mixins.cancelEdit = function (classOptions) {
    classOptions = classOptions || {};

    var CancelEditInst = function () {
            return {
                events: {
                    "click": "cancel"
                },
                cancel: function () {
                    this.uiModel.trigger("cancelEdit");
                    this.uiModel.set({ editing: false });
                }
            };
        };

    Ribs.readMixinOptions(CancelEditInst, classOptions);
    return CancelEditInst;
};

