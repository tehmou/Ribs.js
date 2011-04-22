Ribs.mixins.textValueEdit = function (classOptions) {
    classOptions = classOptions || {};

    var attributeName = classOptions.attributeName;

    if (attributeName && !classOptions.elementSelector) {
        classOptions.elementSelector = '[name|="' + attributeName + '"]';
    }

    var TextValueEdit = function (instanceOptions) {
            return _.extend(new Ribs.MixinBase(classOptions, instanceOptions), {
                modelChanged: function () {
                    if (this.model) {
                        this.model.unbind("ribsUI:commitEdit", this.commit);
                        this.model.unbind("ribsUI:cancelEdit", this.redraw);
                    }
                    Ribs.MixinBase.prototype.modelChanged.apply(this, arguments);
                    if (this.model) {
                        this.model.bind("ribsUI:commitEdit", this.commit);
                        this.model.bind("ribsUI:cancelEdit", this.redraw);
                    }
                },
                redraw: function () {
                    Ribs.MixinBase.prototype.redraw.apply(this, arguments);
                    this.el.val(this.model.get(attributeName));
                },

                commit: function () {
                    var value = this.el.val(), values = {};
                    values[attributeName] = value;
                    this.model.set(values);
                }
            });
        };

    return TextValueEdit;
};

