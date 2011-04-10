Thighbone.mixins.SimpleList = function (myOptions) {
    myOptions = myOptions || {};

    var ItemRenderer = myOptions.ItemRenderer,
        InnerClosure = function () {
            var that, listViews = {},
                addOne = function (item) {
                    if (!listViews.hasOwnProperty(item.cid)) {
                        var listView = new ItemRenderer({ model: item });
                        listViews[item.cid] = listView;
                        invalidated = true;
                    }
                },
                addAll = function () {
                    that.model.each(addOne);
                },
                removeOne = function (item) {
                    delete listViews[item.cid];
                    $(item.el).remove();
                };

            return {
                customInitialize: function () {
                    that = this;
                    this.model.bind("add", addOne);
                    this.model.bind("remove", removeOne);
                    this.model.bind("refresh", addAll);
                    addAll();
                },
                redraw: function () {
                    $(that.el).children().detach();
                    _.each(listViews, function (view) {
                        $(that.el).append(view.el);
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