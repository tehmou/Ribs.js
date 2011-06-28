/**
 * @class
 */
Ribs.backbone.mixins.simpleList = Ribs.compose(
    "support.parent",
    "backbone.support.modelSupport",
    "support.methodInherit",
    "support.myModel",
    {
        inheritingMethods: ["render"],
        
        itemRenderer: null,

        redraw: function () {
            $(this.el).html("");
        },
        render: function () {
            _.each(this._listViews, _.bind(function (view) {
                view.render();
                $(this.el).append(view.el);
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
                    backboneModels: { data: item }
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
                this.myModel.each(_.bind(this.listAdd, this));
            }
            this.pivot.requestInvalidate();
        }
    }
);

