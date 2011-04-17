Ribs.mixins.SimpleList = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        listAttributeName = myOptions.listAttributeName,
        ItemRenderer = myOptions.ItemRenderer,
        SimpleListClosure = function () {
            var parent, listModel, listViews,
                that = {
                    entryPoints: {
                        mixinInitialize: function (value) {
                            parent = value;
                        },
                        modelChanged: function () {
                            _.each(listViews, function (view) {
                                view.dispose();
                            });
                            listViews = {};
                            if (listModel) {
                                listModel.unbind("add", that.addOne);
                                listModel.unbind("remove", that.removeOne);
                                listModel.unbind("refresh", that.addAll);
                            }
                            if (parent.model) {
                                listModel = listAttributeName ? parent.model.get(listAttributeName) : parent.model;
                                listModel.bind("add", that.addOne);
                                listModel.bind("remove", that.removeOne);
                                listModel.bind("refresh", that.addAll);
                                that.addAll();
                            } else {
                                parent.model = null;
                            }
                        },
                        redraw: function () {
                            that.el = elementSelector ? $(parent.el).find(elementSelector) : $(parent.el);
                            that.el.children().detach();
                            _.each(listViews, function (view) {
                                that.el.append(view.el);
                            });
                        },
                        render: function () {
                            _.each(listViews, function (view) {
                                view.render();
                            });
                        }
                    },
                    addOne: function (item) {
                        if (!listViews.hasOwnProperty(item.cid)) {
                            var listView = new ItemRenderer({ model: item });
                            listViews[item.cid] = listView;
                            parent.invalidated = true;
                        }
                    },
                    addAll: function () {
                        listModel.each(that.addOne);
                    },
                    removeOne: function (item) {
                        delete listViews[item.cid];
                        $(item.el).remove();
                    }
                };

            return that;
        };

    return SimpleListClosure;
};

