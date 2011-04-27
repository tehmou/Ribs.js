Ribs.mixins.commitEdit = function (classOptions) {
    var CommitEdit = function () {
            return {
                events: {
                    "click": "commit"
                },
                commit: function () {
                    this.model.ribsUI.trigger("commitEdit");
                    this.model.ribsUI.set({ editing: false });
                }
            };
        };

    return CommitEdit;
};

