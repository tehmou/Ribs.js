describe("Ribs.mixins.backbone.support.modelSupport", function () {
    var models, model, mixin;

    beforeEach(function () {
        models = new Backbone.Model();
        model = new Backbone.Model({
            test: "foo",
            myAttr: "1234"
        });
        mixin = Ribs.compose("backbone.support.modelSupport", {
            modelAdded: function () { },
            modelRemoved: function () { }
        });
        mixin.pivot = mixin;
        mixin.models = models;
        mixin.backboneModels = { modelChooser: model };
    });

    it("Should create model internal automatically", function () {
        mixin.mixinInitialize();
        expect(mixin.getModelJSON({ jsonModelName: "internal" })).toBeDefined();
    });

    it("Should have the given model", function () {
        mixin.mixinInitialize();
        expect(mixin.getModelJSON({ jsonModelName: "modelChooser" })).toBeDefined();
    });

    it("Should resolve json for multiple models", function () {
        mixin.mixinInitialize();
        models.set({ newModel: new Backbone.Model({ val: "text", test: "test" }) });
        mixin.jsonModelName = ["newModel", "modelChooser"];
        Ribs.mixins.support.functions.resolveJSON.apply(mixin);
        expect(mixin.json.val).toEqual("text");
        expect(mixin.json.test).toEqual("foo");
        expect(mixin.json.myAttr).toEqual("1234");
    });

    describe("Model change callbacks", function () {
        var callStack;

        beforeEach(function () {
            callStack = objectCallObserver(mixin);
        });

        afterEach(function () {
            callStack.expectFinished();
        });

        it("Should send model change events on initialize", function () {
            callStack.expectCalls([
                "mixinInitialize",
                { name: "modelAdded" }, // internal
                { name: "modelAdded", arguments: ["modelChooser", model] }
            ]);
            callStack.start();
            mixin.mixinInitialize();
        });

        describe("After initialize", function () {
            
            beforeEach(function () {
                mixin.mixinInitialize();
                callStack.start();
            });

            it("Should inform about model replaced by the user", function () {
                callStack.expectCalls([
                    "modelChangeHandler",
                    "modelRemoved",
                    "modelAdded"
                ]);
                models.set({ modelChooser: new Backbone.Model() });
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
                models.unset("modelChooser");
            });
        });
    });
});