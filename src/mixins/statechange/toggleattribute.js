Ribs.mixins.toggleAttribute = function (classOptions) {
    classOptions = classOptions || {};
    var ToggleAttributeInst = function () {
            return _.extend({
                modelName: "dataUI",
                attributeName: "hei",
                attributeDefaultValue: false,
                onEvent: "click",
                offEvent: null,

                bindEvents: function () {
                    this.events = {};
                    if (this.onEvent) {
                        this.events[this.onEvent] = "toggleOn";
                    }
                    if (this.offEvent && this.offEvent !== this.onEvent) {
                        this.events[this.offEvent] = "toggleOff";
                    }
                },
                bindToModel: function (model) {
                    this.model = model;
                    if (typeof(this.getMyValue()) === "undefined") {
                        this.setMyValue(this.attributeDefaultValue);
                    }
                },

                toggleOn: function () {
                    var newValue = (this.onEvent === this.offEvent) ? !this.getMyValue() : true;
                    this.setMyValue(newValue);
                },
                toggleOff: function () {
                    if (this.onEvent !== this.offEvent) {
                        this.setMyValue(false);
                    }
                }

            }, Ribs.mixinHelpers, classOptions || {});
        };

    return ToggleAttributeInst;
};

