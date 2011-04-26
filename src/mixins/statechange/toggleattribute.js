Ribs.mixins.toggleAttribute = function (classOptions) {
    classOptions = classOptions || {};

    var uiAttributeName = classOptions.uiAttributeName,
        onEvent = classOptions.onEvent || "click",
        offEvent = classOptions.offEvent || "click",
        attributeDefaultValue = classOptions.attributeDefaultValue || false,
        toggling = (onEvent === offEvent),
        ToggleAttribute = function (instanceOptions) {
            var events = {};
            events[onEvent] = "toggleOn";
            if (!toggling) {
                events[offEvent] = "toggleOff";
            }
            return _.extend(new Ribs.MixinBase(classOptions, instanceOptions), {
                events: events,
                modelChanged: function () {
                    Ribs.MixinBase.prototype.modelChanged.apply(this, arguments);
                    if (this.model) {
                        var values = {};
                        values[uiAttributeName] = attributeDefaultValue;
                        this.model.ribsUI.set(values);
                    }
                },

                toggleOn: function () {
                    var values = {};
                    values[uiAttributeName] = toggling ? !this.model.ribsUI.get(uiAttributeName) : true;
                    this.model.ribsUI.set(values);
                },
                toggleOff: function () {
                    if (!toggling) {
                        var values = {};
                        values[uiAttributeName] = false;
                        this.model.ribsUI.set(values);
                    }
                }

            });
        };

    return ToggleAttribute;
};

