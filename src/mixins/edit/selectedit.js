Ribs.mixins.selectEdit = function (classOptions) {
    classOptions = classOptions || {};
    var SelectEditInst = function () {
            var model;
            return _.extend({
                modelName: "data",
                attributeName: null,
                elementSelector: classOptions.attributeName && '[name|="' + classOptions.attributeName + '"]',
                selectOptions: [],

                modelChanging: function () {
                    if (model) {
                        model.unbind("commitEdit", this.commit);
                        model.unbind("cancelEdit", this.redraw);
                    }
                },
                modelChanged: function () {
                    model = this.getMyModel();
                    if (model) {
                        model.bind("commitEdit", this.commit);
                        model.bind("cancelEdit", this.redraw);                        
                    }
                },
                redraw: function () {
                    if (this.el.is("select")) {
                        this.selectEl = this.el;
                    } else {
                        if (this.selectEl) { this.selectEl.remove(); }
                        this.selectEl = $("<select></select>");
                        this.el.append(this.selectEl);
                    }

                    var val = this.getMyValue();
                    _.each(this.selectOptions, _.bind(function (option) {
                        var optionEl = $('<option></option>');
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
                    if (this.selectEl) {
                        this.setMyValue(this.selectEl.val());
                    }
                }
            }, Ribs.mixinBase.withModel, classOptions || {});
        };

    return SelectEditInst;
};

