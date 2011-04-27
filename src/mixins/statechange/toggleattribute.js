Ribs.mixins.toggleAttribute = function (classOptions) {
    classOptions = classOptions || {};

    var uiAttributeName = classOptions.uiAttributeName,
        onEvent = classOptions.onEvent || "click",
        offEvent = classOptions.offEvent || "click",
        attributeDefaultValue = classOptions.attributeDefaultValue || false,
        toggling = (onEvent === offEvent),
        ToggleAttribute = function () {
            var events = {};
            events[onEvent] = "toggleOn";
            if (!toggling) {
                events[offEvent] = "toggleOff";
            }
            return {
                events: events,
                modelChanged: function () {
                    var values = {};
                    values[uiAttributeName] = attributeDefaultValue;
                    this.ribsUI.set(values);
                },

                toggleOn: function () {
                    var values = {};
                    values[uiAttributeName] = toggling ? !this.model.ribsUI.get(uiAttributeName) : true;
                    this.ribsUI.set(values);
                },
                toggleOff: function () {
                    if (!toggling) {
                        var values = {};
                        values[uiAttributeName] = false;
                        this.ribsUI.set(values);
                    }
                }

            };
        };

    return ToggleAttribute;
};

