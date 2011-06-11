describe("Ribs.backbone.modelSupport", function () {
    var models, model, mixin;

    beforeEach(function () {
        models = new Backbone.Model();
        model = new Backbone.Model({
            test: "foo",
            myAttr: "1234"
        });
        mixin = _.extend({}, Ribs.mixinBase.modelful, Ribs.backbone.modelSupport);
        mixin.models = models;
        mixin.backboneModels = { myModel: model };
        mixin.mixinInitialize();
    });

    it("Should create model internal automatically", function () {
        expect(mixin.getModelJSON("internal")).toBeDefined();
    });

    it("Should have the given model", function () {
        expect(mixin.getModelJSON("myModel")).toBeDefined();
    });

    describe("Changing models", function () {
        var callStack;

        beforeEach(function () {
            callStack = objectCallObserver(mixin);
            callStack.start();
        });

        afterEach(function () {
            callStack.expectFinished();
        });

        it("Should inform about model replaced by the user", function () {
            callStack.expectCalls([
                "modelChangeHandler",
                "modelRemoved",
                "modelAdded"
            ]);
            models.set({ myModel: new Backbone.Model() });
        });

        it("Should inform about model added by the user", function () {
            callStack.expectCalls([
                "modelChangeHandler",
                "modelAdded"
            ]);
            models.set({ newModel: new Backbone.Model() });
        });

        it("Should inform about model removed by the user", function () {
            callStack.expectCalls([
                "modelChangeHandler",
                "modelRemoved"
            ]);
            models.unset("myModel");
        });
    });

    it("Should support multiple models", function () {
        models.set({ newModel: new Backbone.Model({ val: "text", test: "test" }) });
        var json = mixin.getModelJSON(["newModel", "myModel"]);
        expect(json.val).toEqual("text");
        expect(json.test).toEqual("foo");
        expect(json.myAttr).toEqual("1234");
    });
});