Ribs.mixins.toggleableClass = function (classOptions) {
    classOptions = classOptions || {};

    var uiAttributeName = classOptions.uiAttributeName,
        className = classOptions.className || uiAttributeName,
        inverse = classOptions.inverse || false,
        uiEventName = "change:" + uiAttributeName,
    
        ToggleableClass = function () {
            return {
                modelChanging: function () {
                    this.ribsUI.unbind(uiEventName, parent.render);
                },
                modelChanged: function () {
                    this.ribsUI.bind(uiEventName, parent.render);
                },
                refresh: function () {
                    var value = this.ribsUI.get(uiAttributeName);
                    inverse && (value = !value);
                    this.el.toggleClass(className, value);
                }
            };
        };

    return ToggleableClass;
};

