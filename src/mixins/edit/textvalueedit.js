
Ribs.mixins.textValueEdit = function (classOptions) {
    classOptions = classOptions || {};
    var TextValueEditInst = function () {
            return _.extend({
                elementSelector: classOptions.attributeName && '[name|="' + classOptions.attributeName + '"]',
                readFunction: null,
                writeFunction: null,

                modelChanging: function () {
                    this.uiModel.unbind("commitEdit", this.commit);
                    this.uiModel.unbind("cancelEdit", this.redraw);
                },
                modelChanged: function () {
                    this.uiModel.bind("commitEdit", this.commit);
                    this.uiModel.bind("cancelEdit", this.redraw);
                },
                redraw: function () {
                    var value = this.myValue;
                    if (this.readFunction) {
                        value = this.readFunction(value);
                    }
                    this.el.val(value);
                },

                commit: function () {
                    if (this.el) {
                        var value = this.el.val(), values = {};
                        if (this.writeFunction) {
                            value = this.writeFunction(value, this.myValue);
                        }
                        if (this.attributeName) {
                            values[this.attributeName] = value;
                            this.dataModel.set(values);
                        } else if (this.uiAttributeName) {
                            values[this.uiAttributeName] = value;
                            this.uiModel.set(values);
                        }
                    }
                }
            }, classOptions || {});
        };

    return TextValueEditInst;
};

