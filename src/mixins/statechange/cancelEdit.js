Ribs.mixins.cancelEdit = function (classOptions) {
    var CancelEdit = function () {
            return {
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

