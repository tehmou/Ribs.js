Ribs.mixins.hoverable = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        HoverableClosure = function () {
            var parent,
                that = {
                    entryPoints: {
                        mixinInitialize: function (value) {
                            parent = value;
                        },
                        modelChanged: function () {
                            parent.model && parent.model.ribsUI.set({ hovering: false });
                        },
                        redraw: function () {
                            that.el = elementSelector ? $(parent.el).find(elementSelector) : $(parent.el);
                        },
                        refresh: function () {
                            that.el
                                    .mouseenter(that.mouseOver)
                                    .mouseleave(that.mouseOut)
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
            return that;
        };

    return HoverableClosure;
};

