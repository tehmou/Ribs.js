Ribs.mixins.toggleableElement = function (classOptions) {
    var ToggleableElementInst = function (parent) {
            var uiEventName;
            return _.extend({
                uiAttributeName: "open",
                inverse: false,

                modelChanging: function () {
                    if (this.uiModel && uiEventName) {
                        this.uiModel.unbind(uiEventName, this.attributeChanged);
                    }
                },
                modelChanged: function () {
                    if (this.uiModel) {
                        uiEventName = "change:" + this.uiAttributeName;
                        this.uiModel.bind(uiEventName, this.attributeChanged);
                    }
                },
                redraw: function () {
                    var value = this.getMyValue();
                    if (this.inverse) {
                        value = !value;
                    }
                    this.el.toggle(value);
                },

                attributeChanged: function () {
                    parent.invalidated = true;
                }
            }, classOptions || {});
        };

    return ToggleableElementInst;
};

