Ribs.mixins.selectEdit = function (classOptions) {
    classOptions = classOptions || {};

    var attributeName = classOptions.attributeName,
        selectOptions = classOptions.options,
        elementSelector = attributeName && '[name|="' + attributeName + '"]';

    var SelectEdit = function () {
        return {
            elementSelector: elementSelector,
            modelChanging: function () {
                this.ribsUI.unbind("commitEdit", this.commit);
                this.ribsUI.unbind("cancelEdit", this.redraw);
            },
            modelChanged: function () {
                this.ribsUI.bind("commitEdit", this.commit);
                this.ribsUI.bind("cancelEdit", this.redraw);
            },
            redraw: function () {
                if (this.el.is("select")) {
                    this.selectEl = this.el;
                } else {
                    if (this.selectEl) { this.selectEl.remove(); }
                    this.selectEl = $("<select></select>");
                    this.el.append(this.selectEl);
                }

                if (this.model) {
                    var val = this.model.get(attributeName);
                    _.each(selectOptions, _.bind(function (option) {
                        var optionEl = $('<option></option>')
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
                this.model.set(values);
            }
        };
    };

    return SelectEdit;
};

