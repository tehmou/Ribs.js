Ribs.mixins.commitEdit = function (classOptions) {
    var CommitEditInst = function () {
            return _.extend({
                modelName: "data",
                events: {
                    "click": "commit"
                },
                commit: function () {
                    if (this.model) {
                        this.model.trigger("ribs:commitEdit");
                    }
                }
            }, Ribs.mixinBase.withModel, classOptions || {});
        };
    return CommitEditInst;
};

