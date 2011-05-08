Ribs.mixins.commitEdit = function (classOptions) {
    classOptions = classOptions || {};
    
    var CommitEditInst = function () {
            return {
                events: {
                    "click": "commit"
                },
                commit: function () {
                    this.uiModel.trigger("commitEdit");
                    this.uiModel.set({ editing: false });
                }
            };
        };

    Ribs.readMixinOptions(CommitEditInst, classOptions);
    return CommitEditInst;
};

