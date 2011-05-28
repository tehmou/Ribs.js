Ribs.mixins.simpleList = function (classOptions) {
    classOptions = classOptions || {};
    var ItemRenderer = classOptions.ItemRenderer,
        SimpleListInst = function (parent) {
            var listModel, listViews, refreshingList;
            return _.extend({
                modelName: "data",
                attributeName: null,
                itemTagName: null,
                itemClassName: null,

                bindToModel: function (model) {
                    _.each(listViews, function (view) {
                        view.dispose();
                    });
                    listViews = {};
                    if (listModel) {
                        listModel.unbind("add", this.addOne);
                        listModel.unbind("remove", this.removeOne);
                        listModel.unbind("refresh", this.addAll);
                    }
                    listModel = this.attributeName ? model.get(this.attributeName) : model;
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
                                tagName: this.itemTagName,
                                className: this.itemClassName
                            });
                        listViews[item.cid] = listView;
                        if (!refreshingList) {
                            parent.invalidated = true;
                            parent.render();
                        }
                    }
                },
                addAll: function () {
                    refreshingList = true;
                    listViews = {};
                    if (listModel.each) {
                        listModel.each(this.addOne);
                    }
                    parent.invalidated = true;
                    parent.render();
                    refreshingList = false;
                },
                removeOne: function (item) {
                    if(listViews.hasOwnProperty(item.cid)) {
                        $(listViews[item.cid].el).remove();
                        delete listViews[item.cid];
                    }
                }
            }, Ribs.mixinBase.withModel, classOptions || {});
        };

    return SimpleListInst;
};

