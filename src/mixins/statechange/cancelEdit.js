Ribs.mixins.cancelEdit = function (classOptions) {
    var CancelEdit = function (instanceOptions) {
            return _.extend(new Ribs.MixinBase(classOptions, instanceOptions), {
                events: {
                    "click": "cancel"
                },
                cancel: function () {
                    this.model.ribsUI.trigger("cancelEdit");
                    this.model.ribsUI.set({ editing: false });
                }
            });
        };

    return CancelEdit;
};

