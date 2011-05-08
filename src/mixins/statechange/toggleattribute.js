Ribs.mixins.toggleAttribute = function (classOptions) {
    classOptions = classOptions || {};

    var attributeName = classOptions.attributeName,
        uiAttributeName = classOptions.uiAttributeName,
        attributeDefaultValue = classOptions.attributeDefaultValue || false,
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
                attributeName: attributeName,
                uiAttributeName: uiAttributeName,
                elementSelector: classOptions.elementSelector,
                updateValue: function (newValue) {
                    var values = {};
                    if (attributeName) {
                        values[attributeName] = newValue;
                        this.model.set(values);
                    } else if (uiAttributeName) {
                        values[uiAttributeName] = newValue;
                        this.ribsUI.set(values);
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

