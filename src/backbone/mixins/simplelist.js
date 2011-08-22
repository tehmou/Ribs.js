/**
 * @class
 */
Ribs.exportMixin("backbone.simpleList", [
    "support.parent",
    "backbone.support.modelSupport",
    "support.modelChooser",
    {
        itemRenderer: null,
        listRendererModelName: "data",

        redraw: function () {
            $(this.el).html("");
        },
        render: function () {
            _.each(this.childViews, _.bind(function (view) {
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
            if (this.childViews) {
                _.each(this.childViews, function (view) {
                    if (_.isFunction(view.dispose)) {
                        view.dispose();
                    }
                });
                this.childViews = {};
            }
            model.unbind("add", this.listAdd);
            model.unbind("remove", this.listRemove);
            model.unbind("refresh", this.listRefresh);
        },
        listAdd: function (item) {
            if (!this.childViews.hasOwnProperty(item.cid)) {
                var models = {}, itemView;
                models[this.listRendererModelName] = item;
                itemView = _.extend({}, this.itemRenderer, {
                    backboneModels: models
                });
                itemView.mixinInitialize();
                this.childViews[item.cid] = itemView;
                this.pivot.requestInvalidate();
            }
        },
        listRemove: function (item) {
            if(this.childViews.hasOwnProperty(item.cid)) {
                $(this.childViews[item.cid].el).remove();
                delete this.childViews[item.cid];
            }
        },
        listRefresh: function () {
            this.childViews = {};
            if (this.myModel && _.isFunction(this.myModel.each)) {
                this.myModel.each(_.bind(this.listAdd, this));
            }
            this.pivot.requestInvalidate();
        }
    }
]);
