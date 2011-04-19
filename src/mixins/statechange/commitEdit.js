Ribs.mixins.commitEdit = function (myOptions) {
    var CommitEdit = function () {
            return _.extend(new Ribs.mixins.MixinBase(myOptions), {
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

