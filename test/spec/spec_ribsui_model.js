describe("Augment model with ribsUI property", function() {
    var model;

    beforeEach(function () {
        model = new Backbone.Model();
    });

    it("Should add a property ribsUI to the model", function () {
        expect(model.hasOwnProperty("ribsUI")).toBeFalsy();
        Ribs.augmentModelWithUIAttributes(model);
        expect(model.hasOwnProperty("ribsUI")).toBeTruthy();
    });

    describe("Augmented model functionality", function () {
        beforeEach(function () {
            Ribs.augmentModelWithUIAttributes(model);
        });

        it("Should not recreate the ribsUI model if it exists", function () {
            var firstRibsUI = model.ribsUI;
            Ribs.augmentModelWithUIAttributes(model);
            expect(model.ribsUI).toEqual(firstRibsUI);
        });

        it("Should propagate events on ribsUI model to the parent model with ribsUI prefix", function () {
            var testObject = { testCallback: function () { } },
                callStack = objectCallObserver(testObject);

            callStack.expectCall("testCallback").start();
            model.bind("ribsUI:change:testProperty", testObject.testCallback);
            model.ribsUI.set({ testProperty: "foo" });
            callStack.expectFinished();
        });
    });
});