Ribs.mixins.commitEdit = function (classOptions) {
    var CommitEditInst = function () {
            return _.extend({
                events: {
                    "click": "commit"
                },
                commit: function () {
                    this.uiModel.trigger("commitEdit");
                    this.uiModel.set({ editing: false });
                }
            }, classOptions || {});
        };
    return CommitEditInst;
};

