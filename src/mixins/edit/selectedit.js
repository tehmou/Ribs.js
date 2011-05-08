Ribs.mixins.selectEdit = function (classOptions) {
    classOptions = classOptions || {};
    var attributeName = classOptions.attributeName,
        selectOptions = classOptions.options,
        elementSelector = attributeName && '[name|="' + attributeName + '"]';

    var SelectEditInst = function () {
        return {
            attributeName: classOptions.attributeName,
            uiAttributeName: classOptions.uiAttributeName,
            elementSelector: elementSelector,
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
                    var val = this.dataModel.get(attributeName);
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
                values[attributeName] = value;
                this.dataModel.set(values);
            }
        };
    };

    return SelectEditInst;
};

