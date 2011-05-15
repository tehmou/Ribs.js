
Ribs.mixins.textValueEdit = function (classOptions) {
    classOptions = classOptions || {};
    var TextValueEditInst = function () {
            return _.extend({
                readFunction: null,
                writeFunction: null,
                elementSelector: (classOptions.attributeName && '[name|="' + classOptions.attributeName + '"]')
                                        || (classOptions.uiAttributeName && '[name|="' + classOptions.uiAttributeName + '"]'),

                modelChanging: function () {
                    this.uiModel.unbind("commitEdit", this.commit);
                    this.uiModel.unbind("cancelEdit", this.redraw);
                },
                modelChanged: function () {
                    this.uiModel.bind("commitEdit", this.commit);
                    this.uiModel.bind("cancelEdit", this.redraw);
                },
                redraw: function () {
                    var value = this.getMyValue();
                    if (this.readFunction) {
                        value = this.readFunction(value);
                    }
                    this.el.val(value);
                },

                commit: function () {
                    if (this.el) {
                        var value = this.el.val();
                        if (this.writeFunction) {
                            value = this.writeFunction(value, this.getMyValue());
                        }
                        this.setMyValue(value);
                    }
                }
            }, classOptions || {});
        };

    return TextValueEditInst;
};

