Ribs.mixins.cancelEdit = function (classOptions) {
    classOptions = classOptions || {};
    var CancelEditInst = function () {
            return {
                attributeName: classOptions.attributeName,
                uiAttributeName: classOptions.uiAttributeName,
                elementSelector: classOptions.elementSelector,
                events: {
                    "click": "cancel"
                },
                cancel: function () {
                    this.uiModel.trigger("cancelEdit");
                    this.uiModel.set({ editing: false });
                }
            };
        };

    return CancelEditInst;
};

