Ribs.mixins.simpleList = function (classOptions) {
    classOptions = classOptions || {};

    var listAttributeName = classOptions.listAttributeName,
        ItemRenderer = classOptions.ItemRenderer,
        itemTagName = classOptions.itemTagName || null,
        itemClassName = classOptions.itemClassName || null,
        SimpleList = function (parent) {
            var listModel, listViews;
            return {
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
                    if (this.model) {
                        listModel = listAttributeName ? this.model.get(listAttributeName) : this.model;
                        listModel.bind("add", this.addOne);
                        listModel.bind("remove", this.removeOne);
                        listModel.bind("refresh", this.addAll);
                        this.addAll();
                    } else {
                        this.model = null;
                    }
                },
                redraw: function () {
                    this.el.children().detach();
                    _.each(listViews, _.bind(function (view) {
                        this.el.append(view.el);
                    }, this));
                },
                render: function () {
                    _.each(listViews, function (view) {
                        view.render();
                    });
                },


                addOne: function (item) {
                    if (!listViews.hasOwnProperty(item.cid)) {
                        var listView = new ItemRenderer({
                            model: item,
                            tagName: itemTagName,
                            className: itemClassName
                        });
                        listViews[item.cid] = listView;
                        parent.invalidated = true;
                    }
                },
                addAll: function () {
                    listModel.each(this.addOne);
                },
                removeOne: function (item) {
                    delete listViews[item.cid];
                    $(item.el).remove();
                }
            };
        };

    return SimpleList;
};

