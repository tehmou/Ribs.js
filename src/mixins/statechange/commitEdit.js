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
                    this.ribsUI.trigger("commitEdit");
                    this.ribsUI.set({ editing: false });
                }
            };
        };

    return CommitEditInst;
};

