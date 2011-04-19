Ribs.mixins.cancelEdit = function (myOptions) {
    var CancelEdit = function () {
            return _.extend(new Ribs.mixins.MixinBase(myOptions), {
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

