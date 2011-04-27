Ribs.mixins.commitEdit = function (classOptions) {
    var CommitEdit = function () {
            return {
                events: {
                    "click": "commit"
                },
                commit: function () {
                    this.ribsUI.trigger("commitEdit");
                    this.ribsUI.set({ editing: false });
                }
            };
        };

    return CommitEdit;
};

