Ribs.mixins.simpleList = function (classOptions) {
    classOptions = classOptions || {};

    var ItemRenderer = classOptions.ItemRenderer,
        itemTagName = classOptions.itemTagName || null,
        itemClassName = classOptions.itemClassName || null,
        SimpleList = function (parent) {
            var listModel, listViews;
            return {
                attributeName: classOptions.attributeName,
                uiAttributeName: classOptions.uiAttributeName,
                elementSelector: classOptions.elementSelector,
                modelChanging: function () {
                    _.each(listViews, function (view) {
                        view.dispose();
                    });
                    listViews = {};
                    if (listModel) {
                        listModel.unbind("add", this.addOne);
                        listModel.unbind("remove", this.removeOne);
                        listModel.unbind("refresh", this.addAll);
                    }
                },
                modelChanged: function () {
                    listModel = this.model;//this.myValue ? this.myValue : this.model;
                    if (listModel) {
                        listModel.bind("add", this.addOne);
                        listModel.bind("remove", this.removeOne);
                        listModel.bind("refresh", this.addAll);
                        this.addAll();
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
                        if (!this.refreshingList) {
                            parent.invalidated = true;
                            parent.render();
                        }
                    }
                },
                addAll: function () {
                    this.refreshingList = true;
                    if (listModel.each) {
                        listModel.each(this.addOne);
                    }
                    parent.invalidated = true;
                    parent.render();
                    this.refreshingList = false;
                },
                removeOne: function (item) {
                    delete listViews[item.cid];
                    $(item.el).remove();
                }
            };
        };

    return SimpleList;
};

