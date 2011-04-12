Ribs.mixins.SimpleList = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        listAttributeName = myOptions.listAttributeName,
        ItemRenderer = myOptions.ItemRenderer,
        initializeOnlyWhenOpen = myOptions.initiazeOnlyWhenOpen || false,
        InnerClosure = function () {
            var that, listModel, listViews,
                addOne = function (item) {
                    if (!listViews.hasOwnProperty(item.cid)) {
                        var listView = new ItemRenderer({ model: item });
                        listViews[item.cid] = listView;
                        invalidated = true;
                    }
                },
                addAll = function () {
                    listModel.each(addOne);
                },
                removeOne = function (item) {
                    delete listViews[item.cid];
                    $(item.el).remove();
                };

            return {
                customInitialize: function () {
                    that = this;
                },
                modelChanged: function () {
                    _.each(listViews, function (view) {
                        view.dispose();
                    });
                    listViews = {};
                    if (listModel) {
                        listModel.unbind("add", addOne);
                        listModel.unbind("remove", removeOne);
                        listModel.unbind("refresh", addAll);
                    }
                    listModel = listAttributeName ? this.model.get(listAttributeName) : this.model;
                    listModel.bind("add", addOne);
                    listModel.bind("remove", removeOne);
                    listModel.bind("refresh", addAll);
                    addAll();
                },
                redraw: function () {
                    var $elem = elementSelector ? $(this.el).find(elementSelector) : $(this.el);
                    $elem.children().detach();
                    _.each(listViews, function (view) {
                        $elem.append(view.el);
                    });
                },
                render: function () {
                    _.each(listViews, function (view) {
                        view.render();
                    });
                }
            };
        };

    return InnerClosure;
};