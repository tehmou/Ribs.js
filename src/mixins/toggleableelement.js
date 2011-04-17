Ribs.mixins.toggleableElement = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        ToggleableElementClosure = function () {
            var parent,
                that = {
                    mixinInitialize: function (value) {
                        parent = value;
                    },
                    managedViewMethods: {
                        modelChanged: function () {
                            parent.model && parent.model.ribsUI.bind("change:open", that.openChanged);
                        },
                        redraw: function () {
                            that.el = elementSelector ? $(parent.el).find(elementSelector) : $(parent.el);
                            that.el.toggle(parent.model.ribsUI.get("open"));
                        }
                    },
                    openChanged: function () {
                        parent && (parent.invalidated = true);
                    }
                };


            return that;
        };

    return ToggleableElementClosure;
};

