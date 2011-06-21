/**
 * @class
 */
Ribs.backbone.mixins.simpleList = Ribs.utils.compose(
    Ribs.support.mixins.myModel,
    {
        itemRenderer: null,

        redraw: function () {
            $(this.el).html("");
            _.each(this._listViews, _.bind(function (view) {
                if (_.isFunction(view.redraw)) {
                    view.redraw();
                }
                $(this.el).append(view.el);
            }, this));
        },
        refresh: function () {
            _.each(this._listViews, _.bind(function (view) {
                if (_.isFunction(view.refresh)) {
                    view.refresh();
                }
            }, this));
        },
        myModelAdded: function (model) {
            model.bind("add", this.listAdd);
            model.bind("remove", this.listRemove);
            model.bind("refresh", this.listRefresh);
            this.listRefresh();
        },
        myModelRemoved: function (model) {
            if (this._listViews) {
                _.each(this._listViews, function (view) {
                    if (_.isFunction(view.dispose)) {
                        view.dispose();
                    }
                });
                this._listViews = {};
            }
            model.unbind("add", this.listAdd);
            model.unbind("remove", this.listRemove);
            model.unbind("refresh", this.listRefresh);
        },
        listAdd: function (item) {
            if (!this._listViews.hasOwnProperty(item.cid)) {
                var itemView = _.extend({}, this.itemRenderer, {
                    backboneModels: { data: item },
                    jsonModelName: "data"
                });
                itemView.mixinInitialize();
                this._listViews[item.cid] = itemView;
                this.pivot.requestInvalidate();
            }
        },
        listRemove: function (item) {
            if(this._listViews.hasOwnProperty(item.cid)) {
                $(this._listViews[item.cid].el).remove();
                delete this._listViews[item.cid];
            }
        },
        listRefresh: function () {
            this._listViews = {};
            if (this.myModel && _.isFunction(this.myModel.each)) {
                this.myModel.each(this.listAdd);
            }
            this.pivot.requestInvalidate();
        }
    }
);

