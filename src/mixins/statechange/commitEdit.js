Ribs.mixins.commitEdit = function (classOptions) {
    var CommitEdit = function (instanceOptions) {
            return _.extend(new Ribs.MixinBase(classOptions, instanceOptions), {
                events: {
                    "click": "commit"
                },
                commit: function () {
                    this.model.ribsUI.trigger("commitEdit");
                    this.model.ribsUI.set({ editing: false });
                }
            });
        };

    return CommitEdit;
};

