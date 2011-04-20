Ribs.mixins.textValueEdit = function (myOptions) {
    myOptions = myOptions || {};

    var attributeName = myOptions.attributeName;

    if (attributeName && !myOptions.elementSelector) {
        myOptions.elementSelector = '[name|="' + attributeName + '"]';
    }

    var TextValueEdit = function () {
        return _.extend(new Ribs.mixins.MixinBase(myOptions),
        {
            modelChanged: function () {
                if (this.model) {
                    this.model.unbind("ribsUI:commitEdit", this.commit);
                    this.model.unbind("ribsUI:cancelEdit", this.redraw);
                }
                Ribs.mixins.MixinBase.prototype.modelChanged.apply(this, arguments);
                if (this.model) {
                    this.model.bind("ribsUI:commitEdit", this.commit);
                    this.model.bind("ribsUI:cancelEdit", this.redraw);
                }
            },
            redraw: function () {
                Ribs.mixins.MixinBase.prototype.redraw.apply(this, arguments);
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

