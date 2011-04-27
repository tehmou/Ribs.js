Ribs.mixins.cancelEdit = function (classOptions) {
    var CancelEdit = function () {
            return {
                events: {
                    "click": "cancel"
                },
                cancel: function () {
                    this.model.ribsUI.trigger("cancelEdit");
                    this.model.ribsUI.set({ editing: false });
                }
            };
        };

    return CancelEdit;
};

