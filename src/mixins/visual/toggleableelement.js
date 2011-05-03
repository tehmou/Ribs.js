Ribs.mixins.toggleableElement = function (classOptions) {
    classOptions = classOptions || {};

    var inverse = classOptions.inverse || false,
        uiAttributeName = classOptions.uiAttributeName || "open",
        uiEventName = "change:" + uiAttributeName,

        ToggleableElement = function (parent) {
            return {
                attributeName: classOptions.attributeName,
                uiAttributeName: uiAttributeName,
                elementSelector: classOptions.elementSelector,
                modelChanging: function () {
                    if (this.ribsUI) {
                        this.ribsUI.unbind(uiEventName, this.attributeChanged);
                    }
                },
                modelChanged: function () {
                    if (this.ribsUI) {
                        this.ribsUI.bind(uiEventName, this.attributeChanged);
                    }
                },
                redraw: function () {
                    var value = this.myValue;
                    inverse && (value = !value);
                    this.el.toggle(value);
                },

                attributeChanged: function () {
                    parent.invalidated = true;
                }
            };
        };

    return ToggleableElement;
};

