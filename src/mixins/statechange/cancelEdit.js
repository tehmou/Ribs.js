Ribs.mixins.cancelEdit = function (classOptions) {
    classOptions = classOptions || {};
    var CancelEdit = function () {
            return {
                attributeName: classOptions.attributeName,
                uiAttributeName: classOptions.uiAttributeName,
                elementSelector: classOptions.elementSelector,
                events: {
                    "click": "cancel"
                },
                cancel: function () {
                    this.ribsUI.trigger("cancelEdit");
                    this.ribsUI.set({ editing: false });
                }
            };
        };

    return CancelEdit;
};

