Ribs.mixins.editable = function (myOptions) {
    var Editable = function () {
            return _.extend(new Ribs.mixins.MixinBase(myOptions), {
                events: {
                    "click": "edit"
                },
                edit: function () {
                    this.parent.model.ribsUI.set({ editing: true });
                }
            });
        };

    return Editable;
};

