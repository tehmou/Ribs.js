Ribs.mixins.textValueEdit = function (classOptions) {
    classOptions = classOptions || {};

    var attributeName = classOptions.attributeName,
        elementSelector = attributeName && '[name|="' + attributeName + '"]';

    var TextValueEdit = function () {
            return {
                elementSelector: elementSelector,
                modelChanging: function () {
                    this.ribsUI.unbind("ribsUI:commitEdit", this.commit);
                    this.ribsUI.unbind("ribsUI:cancelEdit", this.redraw);
                },
                modelChanged: function () {
                    this.ribsUI.bind("ribsUI:commitEdit", this.commit);
                    this.ribsUI.bind("ribsUI:cancelEdit", this.redraw);
                },
                redraw: function () {
                    if (this.model) {
                        this.el.val(this.model.get(attributeName));
                    }
                },

                commit: function () {
                    var value = this.el.val(), values = {};
                    values[attributeName] = value;
                    this.model.set(values);
                }
            };
        };

    return TextValueEdit;
};

