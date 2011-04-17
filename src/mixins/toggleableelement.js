Ribs.mixins.toggleableElement = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        ToggleableElementClosure = function () {
            var parent,
                that = {
                    openChanged: function () {
                        parent && (parent.invalidated = true);
                    },

                    managedViewMethods: {
                        mixinInitialize: function (value) {
                            parent = value;
                        },
                        modelChanged: function () {
                            parent.model && parent.model.ribsUI.bind("change:open", that.openChanged);
                        },
                        redraw: function () {
                            that.el = elementSelector ? $(parent.el).find(elementSelector) : $(parent.el);
                            that.el.toggle(parent.model.ribsUI.get("open"));
                        }
                    }
                };


            return that;
        };

    return ToggleableElementClosure;
};

