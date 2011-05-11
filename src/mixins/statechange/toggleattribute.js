Ribs.mixins.toggleAttribute = function (classOptions) {
    classOptions = classOptions || {};
    var ToggleAttributeInst = function () {
            return _.extend(classOptions, {
                events: {},
                attributeDefaultValue: false,
                onEvent: "click",
                offEvent: null,

                bindEvents: function () {
                    if (this.onEvent) {
                        this.events[this.onEvent] = "toggleOn";
                    }
                    if (this.offEvent && this.offEvent !== this.onEvent) {
                        this.events[this.offEvent] = "toggleOff";
                    }
                },

                updateValue: function (newValue) {
                    var values = {};
                    if (this.attributeName && this.dataModel) {
                        values[this.attributeName] = newValue;
                        this.dataModel.set(values);
                    } else if (this.uiAttributeName) {
                        values[this.uiAttributeName] = newValue;
                        this.uiModel.set(values);
                    }
                },
                modelChanged: function (model) {
                    if (typeof(this.myValue) === "undefined") {
                        this.updateValue(this.attributeDefaultValue);
                    }
                },

                toggleOn: function () {
                    var newValue = (this.onEvent === this.offEvent) ? !this.myValue : true;
                    this.updateValue(newValue);
                },
                toggleOff: function () {
                    if (this.onEvent !== this.offEvent) {
                        this.updateValue(false);
                    }
                }

            }, classOptions || {});
        };

    return ToggleAttributeInst;
};

