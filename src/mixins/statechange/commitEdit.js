Ribs.mixins.commitEdit = function (classOptions) {
    classOptions = classOptions || {};
    var CommitEditInst = function () {
            return {
                attributeName: classOptions.attributeName,
                uiAttributeName: classOptions.uiAttributeName,
                elementSelector: classOptions.elementSelector,
                events: {
                    "click": "commit"
                },
                commit: function () {
                    this.uiModel.trigger("commitEdit");
                    this.uiModel.set({ editing: false });
                }
            };
        };

    return CommitEditInst;
};

