Ribs.mixins.selectEdit = function (myOptions) {
    myOptions = myOptions || {};

    var attributeName = myOptions.attributeName,
        selectOptions = myOptions.options;

    if (attributeName && !myOptions.elementSelector) {
        myOptions.elementSelector = '[name|="' + attributeName + '"]';
    }

    var SelectEdit = function () {
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

