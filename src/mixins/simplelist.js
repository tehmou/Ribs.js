/**
 * @method
 * @desc Most complicated of the standard mixins, but this could
 * not be avoided. Creates a list of a defined Backbone.Collection,
 * binds to changes in it, and updates itself accordingly.<br /><br />
 *
 * If item are added dynamically one-by-one, they are inserted at the
 * bottom of the list. If the order is crucial while adding new ones,
 * invalidate the parent View to call redraw when rendering.
 *
 * @param classOptions
 * @param classOptions.ItemRenderer Backbone.View class to instantiate
 * for every item on the list.
 * @param classOptions.itemTagName Name of the tag of the new list items.
 * This has to be defined in the list itself because the list items cannot
 * affect the name of their own element tag after creation. This is
 * because of the design of Backbone.View.
 * @param classOptions.itemClassName Same as itemTagName, except that
 * this one is set as the class of each new list item element.
 */
Ribs.mixins.simpleList = function (classOptions) {
    classOptions = classOptions || {};
    var ItemRenderer = classOptions.ItemRenderer,
        SimpleListInst = function (parent) {
            var listModel, listViews, refreshingList;
            return _.extend({
                itemTagName: null,
                itemClassName: null,

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
                    listModel = this.myValue ? this.myValue : this.dataModel;
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
                    if (listViews[item.cid]) {
                        $(listViews[item.cid].el).remove();
                        delete listViews[item.cid];
                    }
                }
            }, classOptions || {});
        };

    return SimpleListInst;
};

