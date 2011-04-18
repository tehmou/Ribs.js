Ribs.mixins.simpleList = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        listAttributeName = myOptions.listAttributeName,
        ItemRenderer = myOptions.ItemRenderer,
        SimpleList = function (parent) {
            var listModel, listViews,
                mixin = {
                    managedViewMethods: {
                        modelChanged: function () {
                            _.each(listViews, function (view) {
                                view.dispose();
                            });
                            listViews = {};
                            if (listModel) {
                                listModel.unbind("add", mixin.addOne);
                                listModel.unbind("remove", mixin.removeOne);
                                listModel.unbind("refresh", mixin.addAll);
                            }
                            if (parent.model) {
                                listModel = listAttributeName ? parent.model.get(listAttributeName) : parent.model;
                                listModel.bind("add", mixin.addOne);
                                listModel.bind("remove", mixin.removeOne);
                                listModel.bind("refresh", mixin.addAll);
                                mixin.addAll();
                            } else {
                                parent.model = null;
                            }
                        },
                        redraw: function () {
                            mixin.el = elementSelector ? $(parent.el).find(elementSelector) : $(parent.el);
                            mixin.el.children().detach();
                            _.each(listViews, function (view) {
                                mixin.el.append(view.el);
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
                        listModel.each(mixin.addOne);
                    },
                    removeOne: function (item) {
                        delete listViews[item.cid];
                        $(item.el).remove();
                    }
                };

            return mixin;
        };

    return SimpleList;
};

