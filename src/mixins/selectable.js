Ribs.mixins.selectable = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        Selectable = function (parent) {
            var mixin = {
                    events: {
                        "click": "elementClicked"
                    },
                    managedViewMethods: {
                        modelChanged: function () {
                            parent.model && parent.model.ribsUI.set({ selected: false });
                        },
                        redraw: function () {
                            mixin.el = elementSelector ? $(parent.el).find(elementSelector) : $(parent.el);
                        },
                        refresh: function () {
                            mixin.el.toggleClass("selected", parent.model.ribsUI.get("selected"));
                        }
                    },
                    
                    elementClicked: function () {
                        parent.model.ribsUI.set({ selected: !parent.model.ribsUI.get("selected") });
                    }
                };

            return mixin;
        };

    return Selectable;
};

