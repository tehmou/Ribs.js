/**
 * @class
 */
Ribs.backbone.utils.Model = function(attributes, options) {
    var supportAttributes = {};
    if (_.isArray(attributes)) {
        supportAttributes = attributes[1];
        attributes = attributes[0];
    }
    Backbone.Model.apply(this, [attributes, options]);
    var supportModel = new Backbone.Model(supportAttributes);
    supportModel.bind("change", _.bind(function (ev) {
        this.trigger("support:" + ev);
    }, this));
    this.supportModel = supportModel;
};

_.extend(Ribs.backbone.utils.Model.prototype, Backbone.Model.prototype);