/*global Backbone*/

Ribs.backbone.create = function () {
    var args = Array.prototype.concat.apply([{}, Ribs.backbone.backbonePivot], arguments);
    return Ribs.utils.addingExtend.apply(this, args);
};

Ribs.mixins.backbone = Ribs.backbone.mixins = {};

