Ribs.mixins.textValueEdit = function (classOptions) {
    classOptions = classOptions || {};

    var TextValueEdit = function () {
            return {
                attributeName: classOptions.attributeName,
                uiAttributeName: classOptions.uiAttributeName,
                elementSelector: classOptions.elementSelector ||
                        (classOptions.attributeName && '[name|="' + classOptions.attributeName + '"]'),
                readFunction: classOptions.readFunction,
                writeFunction: classOptions.writeFunction,
                modelChanging: function () {
                    this.ribsUI.unbind("commitEdit", this.commit);
                    this.ribsUI.unbind("cancelEdit", this.redraw);
                },
                modelChanged: function () {
                    this.ribsUI.bind("commitEdit", this.commit);
                    this.ribsUI.bind("cancelEdit", this.redraw);
                },
                redraw: function () {
                    var value = this.myValue;
                    if (this.readFunction) {
                        value = this.readFunction(value);
                    }
                    this.el.val(value);
                },

                commit: function () {
                    var value = this.el.val(), values = {};
                    if (this.writeFunction) {
                        value = this.writeFunction(value, this.myValue);
                    }
                    if (this.attributeName) {
                        values[this.attributeName] = value;
                        this.model.set(values);
                    } else if (this.uiAttributeName) {
                        values[this.uiAttributeName] = value;
                        this.ribsUI.set(values);
                    }
                }
            };
        };

    return TextValueEdit;
};

