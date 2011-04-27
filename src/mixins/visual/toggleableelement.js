Ribs.mixins.toggleableElement = function (classOptions) {
    classOptions = classOptions || {};

    var uiAttributeName = classOptions.uiAttributeName || "open",
        inverse = classOptions.inverse || false,
        uiEventName = "change:" + uiAttributeName,

        ToggleableElement = function (parent) {
            return {
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
                    var value = this.ribsUI.get(uiAttributeName);
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

