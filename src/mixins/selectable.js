Ribs.mixins.selectable = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        SelectableClosure = function () {
            var parent,
                that = {
                    events: {
                        "click": "elementClicked"
                    },
                    entryPoints: {
                        mixinInitialize: function (value) {
                            parent = value;
                        },
                        modelChanged: function () {
                            parent.model && parent.model.ribsUI.set({ selected: false });
                        },
                        redraw: function () {
                            that.el = elementSelector ? $(parent.el).find(elementSelector) : $(parent.el);
                        },
                        refresh: function () {
                            that.el.toggleClass("selected", parent.model.ribsUI.get("selected"));
                        }
                    },
                    
                    elementClicked: function () {
                        parent.model.ribsUI.set({ selected: !parent.model.ribsUI.get("selected") });
                    }
                };

            return that;
        };

    return SelectableClosure;
};

