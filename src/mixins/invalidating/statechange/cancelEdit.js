Ribs.mixins.cancelEdit = function (classOptions) {
    var CancelEditInst = function () {
            return _.extend({
                modelName: "data",
                events: {
                    "click": "cancel"
                },
                cancel: function () {
                    if (this.model) {
                        this.model.trigger("ribs:cancelEdit");
                    }
                }
            }, Ribs.mixinBase.withModel, classOptions || {});
        };

    return CancelEditInst;
};

