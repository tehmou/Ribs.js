Ribs.mixins.toggleableClass = function (classOptions) {
    classOptions = classOptions || {};

    var uiAttributeName = classOptions.uiAttributeName || "selected",
        className = classOptions.className || uiAttributeName,
        inverse = classOptions.inverse || false,
        uiEventName = "change:" + uiAttributeName,
    
        ToggleableClass = function () {
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
                    this.el.toggleClass(className, value);
                },


                attributeChanged: function () {
                    this.parent && (this.parent.invalidated = true);
                }
            };
        };

    return ToggleableClass;
};

