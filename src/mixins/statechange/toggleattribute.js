Ribs.mixins.toggleAttribute = function (classOptions) {
    classOptions = classOptions || {};

    var attributeDefaultValue = classOptions.attributeDefaultValue || false,
        onEvent = (typeof(classOptions.onEvent) !== "undefined") ? classOptions.onEvent : "click",
        offEvent = classOptions.offEvent,
        sameEvent = (typeof(classOptions.sameEvent) !== "undefined") ? classOptions.sameEvent : (onEvent === offEvent),
    
        ToggleAttributeInst = function () {
            var events = {};
            if (onEvent) {
                events[onEvent] = "toggleOn";
            }
            if (!sameEvent && offEvent) {
                events[offEvent] = "toggleOff";
            }
            return {
                events: events,
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
                        this.updateValue(attributeDefaultValue);
                    }
                },

                toggleOn: function () {
                    var newValue = sameEvent ? !this.myValue : true;
                    this.updateValue(newValue);
                },
                toggleOff: function () {
                    if (!sameEvent) {
                        this.updateValue(false);
                    }
                }

            };
        };

    return ToggleAttributeInst;
};

