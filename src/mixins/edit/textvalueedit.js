Ribs.mixins.textValueEdit = function (classOptions) {
    classOptions = classOptions || {};

    var TextValueEdit = function () {
            return {
                attributeName: classOptions.attributeName,
                uiAttributeName: classOptions.uiAttributeName,
                elementSelector: classOptions.elementSelector ||
                        (this.attributeName && '[name|="' + this.attributeName + '"]'),
                modelChanging: function () {
                    this.ribsUI.unbind("commitEdit", this.commit);
                    this.ribsUI.unbind("cancelEdit", this.redraw);
                },
                modelChanged: function () {
                    this.ribsUI.bind("commitEdit", this.commit);
                    this.ribsUI.bind("cancelEdit", this.redraw);
                },
                redraw: function () {
                    if (this.model) {
                        this.el.val(this.model.get(this.attributeName));
                    }
                },

                commit: function () {
                    var value = this.el.val(), values = {};
                    values[this.attributeName] = value;
                    this.model.set(values);
                }
            };
        };

    return TextValueEdit;
};

