/**
 * @method
 * @desc Binds itself to DOM events and toggles a desired
 * data or UI attribute accordingly.
 *
 * @param classOptions
 * @param classOptions.attributeDefaultValue If the data or UI
 * model does not have the desired property, initialize it as this.
 * Default is "false".
 * @param classOptions.onEvent jQuery DOM event to listen for
 * setting the attribute to true. Default: "click"
 * @param classOptions.offEvent jQuery DOM event to listen for
 * setting the attribute to false. Default: null
 */
Ribs.mixins.toggleAttribute = function (classOptions) {
    classOptions = classOptions || {};
    var ToggleAttributeInst = function () {
            return _.extend({
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

