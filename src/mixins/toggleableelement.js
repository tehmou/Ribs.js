Ribs.mixins.toggleableElement = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        ToggleableElement = function (parent) {
            var mixin = {
                    managedViewMethods: {
                        modelChanged: function () {
                            parent.model && parent.model.ribsUI.bind("change:open", mixin.openChanged);
                        },
                        redraw: function () {
                            mixin.el = elementSelector ? $(parent.el).find(elementSelector) : $(parent.el);
                            mixin.el.toggle(parent.model.ribsUI.get("open"));
                        }
                    },
                    openChanged: function () {
                        parent && (parent.invalidated = true);
                    }
                };


            return mixin;
        };

    return ToggleableElement;
};

