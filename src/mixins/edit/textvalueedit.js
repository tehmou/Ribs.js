
Ribs.mixins.textValueEdit = function (classOptions) {
    classOptions = classOptions || {};
    var TextValueEditInst = function () {
            var model;
            return _.extend({
                modelName: "data",
                readFunction: null,
                writeFunction: null,
                elementSelector: (classOptions.attributeName && '[name|="' + classOptions.attributeName + '"]')
                                        || (classOptions.uiAttributeName && '[name|="' + classOptions.uiAttributeName + '"]'),

                modelChanging: function () {
                    if (model) {
                        model.unbind("ribs:commitEdit", this.commit);
                        model.unbind("ribs:cancelEdit", this.redraw);
                    }
                },
                modelChanged: function () {
                    model = this.getMyModel();
                    if (model) {
                        model.bind("ribs:commitEdit", this.commit);
                        model.bind("ribs:cancelEdit", this.redraw);
                    }
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

