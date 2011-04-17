Ribs.mixins.toggleButton = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        usePlusMinus = myOptions.usePlusMinus,
        ToggleButtonClosure = function () {
            var parent,
                that = {
                    mixinInitialize: function (value) {
                        parent = value;
                    },
                    events: {
                        "click": "toggle"
                    },
                    managedViewMethods: {
                        modelChanged: function () {
                            parent.model && parent.model.ribsUI.set({ open: false });
                        },
                        redraw: function () {
                            that.el = elementSelector ? $(parent.el).find(elementSelector) : $(parent.el);
                        },
                        refresh: function () {
                            if (usePlusMinus) {
                                that.el.text(parent.model.ribsUI.get("open") ? "-" : "+");
                            }
                        }
                    },
                    toggle: function () {
                        parent.model.ribsUI.set({ open: !parent.model.ribsUI.get("open") });
                    }
                };

            return that;
        };

    return ToggleButtonClosure;
};

