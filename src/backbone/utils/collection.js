Ribs.backbone.utils.Collection = function (models, options) {
    this.model = options.model || Backbone.Model;
    Backbone.Collection.apply(this, arguments);
};

_.extend(Ribs.backbone.utils.Collection.prototype, Backbone.Collection.prototype);
