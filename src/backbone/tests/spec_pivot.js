describe("Ribs.backbone.mixins.pivot", function () {
    var model, pivot;

    beforeEach(function () {
        model = new Backbone.Model();
        pivot = _.extend({}, Ribs.backbone.mixins.pivot);
        pivot.backboneModels = {
            modelChooser: model
        };
        pivot.mixinInitialize();
    });

    it("Should not allow initializing twice", function () {
        var threwException = false;
        try {
            pivot.mixinInitialize();
        } catch (e) {
            threwException = true;
        }
        expect(threwException).toBeTruthy();
    });
});