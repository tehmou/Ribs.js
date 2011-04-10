Thighbone.mixins.NestedList = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        listAttributeName = myOptions.listAttributeName,
        ItemRenderer = myOptions.ItemRenderer,
        nestedTagName = myOptions.nestedTagName || "div",
        SimpleListView = Thighbone.createMixed({
            mixinClasses: [ Thighbone.mixins.SimpleList({ ItemRenderer: ItemRenderer }) ]
        });
        InnerClosure = function () {
            var that, simpleListView, listModel,
                openChanged = function () {
                    that.invalidated = true;
                };

            return {
                customInitialize: function () {
                    that = this;
                    this.model.bind("thighbone:ui:open", openChanged);
                    listModel = this.model.get(listAttributeName);
                },
                redraw: function () {
                    if (this.model.thighboneUI.get("open") && !simpleListView) {
                        if (elementSelector) {
                            simpleListView = new SimpleListView({ model: listModel, el: $(this.el).find(elementSelector) });
                        } else {
                            simpleListView = new SimpleListView({ model: listModel, tagName: nestedTagName });
                        }
                    }
                    if (simpleListView) {
                        $(this.el).append(simpleListView.el);
                        $(simpleListView.el).toggle(this.model.thighboneUI.get("open"));
                    }
                },
                render: function () {
                    simpleListView && simpleListView.render();
                }
            };
        };

    return InnerClosure;
};