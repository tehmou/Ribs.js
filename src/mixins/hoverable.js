Ribs.mixins.hoverable = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        Hoverable = function (parent) {
            var mixin = {
                    managedViewMethods: {
                        modelChanged: function () {
                            parent.model && parent.model.ribsUI.set({ hovering: false });
                        },
                        redraw: function () {
                            mixin.el = elementSelector ? $(parent.el).find(elementSelector) : $(parent.el);
                        },
                        refresh: function () {
                            mixin.el
                                    .mouseenter(mixin.mouseOver)
                                    .mouseleave(mixin.mouseOut)
                                    .toggleClass("hovering", parent.model.ribsUI.get("hovering"));
                        }
                    },

                    mouseOver: function () {
                        parent.model.ribsUI.set({ hovering: true });
                    },
                    mouseOut: function () {
                        parent.model.ribsUI.set({ hovering: false });
                    }
                };
            return mixin;
        };

    return Hoverable;
};

