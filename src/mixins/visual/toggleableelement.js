Ribs.mixins.toggleableElement = function (classOptions) {
    classOptions = classOptions || {};

    var inverse = classOptions.inverse || false,
        uiEventName = "change:" + uiAttributeName,

        ToggleableElement = function (parent) {
            return {
                uiAttributeName: classOptions.uiAttributeName || "open",
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

