Ribs.mixins.commitEdit = function (classOptions) {
    var CommitEditInst = function () {
            return _.extend({
                modelName: "data",
                events: {
                    "click": "commit"
                },
                commit: function () {
                    this.getMyModel().trigger("ribs:commitEdit");
                }
            }, classOptions || {});
        };
    return CommitEditInst;
};

