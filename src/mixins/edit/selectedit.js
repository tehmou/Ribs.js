Ribs.mixins.selectEdit = function (classOptions) {
    classOptions = classOptions || {};

    var attributeName = classOptions.attributeName,
        selectOptions = classOptions.options;

    if (attributeName && !classOptions.elementSelector) {
        classOptions.elementSelector = '[name|="' + attributeName + '"]';
    }

    var SelectEdit = function (instanceOptions) {
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
                if (this.el.is("select")) {
                    this.selectEl = this.el;
                } else {
                    if (this.selectEl) { this.selectEl.remove(); }
                    this.selectEl = $("<select></select>");
                    this.el.append(this.selectEl);
                }

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
            },

            commit: function () {
                var value = this.selectEl.val(), values = {};
                values[attributeName] = value;
                this.model.set(values);
            }
        });
    };

    return SelectEdit;
};

