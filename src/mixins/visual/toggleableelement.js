Ribs.mixins.toggleableElement = function (classOptions) {
    classOptions = classOptions || {};

    var inverse = classOptions.inverse || false,
        uiAttributeName = classOptions.uiAttributeName || "open",
        uiEventName = "change:" + uiAttributeName,

        ToggleableElementInst = function (parent) {
            return {
                attributeName: classOptions.attributeName,
                uiAttributeName: uiAttributeName,
                elementSelector: classOptions.elementSelector,
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

    return ToggleableElementInst;
};

