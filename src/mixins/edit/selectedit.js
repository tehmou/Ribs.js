Ribs.mixins.selectEdit = function (classOptions) {
    classOptions = classOptions || {};
    classOptions.elementSelector = classOptions.attributeName && '[name|="' + classOptions.attributeName + '"]';

    var selectOptions = classOptions.selectOptions,

        SelectEditInst = function () {
            return {
                modelChanging: function () {
                    this.uiModel.unbind("commitEdit", this.commit);
                    this.uiModel.unbind("cancelEdit", this.redraw);
                },
                modelChanged: function () {
                    this.uiModel.bind("commitEdit", this.commit);
                    this.uiModel.bind("cancelEdit", this.redraw);
                },
                redraw: function () {
                    if (this.el.is("select")) {
                        this.selectEl = this.el;
                    } else {
                        if (this.selectEl) { this.selectEl.remove(); }
                        this.selectEl = $("<select></select>");
                        this.el.append(this.selectEl);
                    }

                    if (this.dataModel) {
                        var val = this.dataModel.get(this.attributeName);
                        _.each(selectOptions, _.bind(function (option) {
                            var optionEl = $('<option></option>');
                            optionEl
                                    .attr("value", option.value)
                                    .text(option.text);
                            if (option.value === val) {
                                optionEl.attr("selected", "selected");
                            }
                            this.selectEl.append(optionEl);
                        }, this));
                    }
                },

                commit: function () {
                    var value = this.selectEl.val(), values = {};
                    values[this.attributeName] = value;
                    this.dataModel.set(values);
                }
            };
        };

    Ribs.readMixinOptions(SelectEditInst, classOptions);
    return SelectEditInst;
};

