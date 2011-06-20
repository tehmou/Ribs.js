describe("Ribs.backbone.backbonePivot", function () {
    var model, pivot;

    beforeEach(function () {
        model = new Backbone.Model();
        pivot = _.extend({}, Ribs.backbone.backbonePivot);
        pivot.backboneModels = {
            myModel: model
        };
        pivot.mixinInitialize();
    });
});