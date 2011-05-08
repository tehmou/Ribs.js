Ribs.mixins.toggleableElement = function (classOptions) {
    classOptions = classOptions || {};
    classOptions.uiAttributeName = classOptions.uiAttributeName || "open";

    var inverse = classOptions.inverse || false,
        uiEventName = "change:" + classOptions.uiAttributeName,

        ToggleableElementInst = function (parent) {
            return {
                modelChanging: function () {
                    if (this.uiModel) {
                        this.uiModel.unbind(uiEventName, this.attributeChanged);
                    }
                },
                modelChanged: function () {
                    if (this.uiModel) {
                        this.uiModel.bind(uiEventName, this.attributeChanged);
                    }
                },
                redraw: function () {
                    var value = this.myValue;
                    if (inverse) {
                        value = !value;
                    }
                    this.el.toggle(value);
                },

                attributeChanged: function () {
                    parent.invalidated = true;
                }
            };
        };

    Ribs.readMixinOptions(ToggleableElementInst);
    return ToggleableElementInst;
};

