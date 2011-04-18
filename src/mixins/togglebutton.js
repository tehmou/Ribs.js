Ribs.mixins.toggleButton = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        usePlusMinus = myOptions.usePlusMinus,
        ToggleButton = function (parent) {
            var mixin = {
                    events: {
                        "click": "toggle"
                    },
                    managedViewMethods: {
                        modelChanged: function () {
                            parent.model && parent.model.ribsUI.set({ open: false });
                        },
                        redraw: function () {
                            mixin.el = elementSelector ? $(parent.el).find(elementSelector) : $(parent.el);
                        },
                        refresh: function () {
                            if (usePlusMinus) {
                                mixin.el.text(parent.model.ribsUI.get("open") ? "-" : "+");
                            }
                        }
                    },
                    toggle: function () {
                        parent.model.ribsUI.set({ open: !parent.model.ribsUI.get("open") });
                    }
                };

            return mixin;
        };

    return ToggleButton;
};

