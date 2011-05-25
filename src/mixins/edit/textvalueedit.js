/**
 * @method
 * @desc Takes an input field as its element (does not create one,
 * though, use templates) and utilizes it to edit the defined
 * model attribute. Works for both original data models and the
 * UI models attached to them. See Ribs.mixins.mixinComposite for
 * documentation of the generic options for mixins.
 *
 * @param classOptions
 * @param classOptions.elementSelector The default elementSelector is set to
 * look for elements with the same name as the given attributeName.
 * @param classOptions.readFunction If set, the attribute value read
 * from the model field is processed through this function.
 * @param classOptions.writeFunction If set, the value read from the
 * input field in DOM is processed through this function before
 * inserting into the corresponding model.
 */
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

