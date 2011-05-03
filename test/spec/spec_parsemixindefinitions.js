describe("parseMixinDefinitions", function () {
    var oldMixins = Ribs.mixins, callStack;

    beforeEach(function () {
        Ribs.mixins = {
            createTestMixin1: function () { return this; },
            createTestMixin2: function () { return this; }
        };
        callStack = objectCallObserver(Ribs.mixins);
    });

    afterEach(function () {
        Ribs.mixins = oldMixins;
        callStack.expectFinished();
    });

    it("Should try to create appropriate mixins", function () {
        callStack.expectCalls([
            "createTestMixin1",
            "createTestMixin2"
        ]).start();
        Ribs.parseMixinDefinitions([
            { createTestMixin1: {} },
            { createTestMixin2: {} }
        ]);
    });

    it("Should give mixins their creation arguments as options", function () {
        var elementSelector = "div", model = { myModel: true };
        callStack.expectCall({
             name: "createTestMixin1",
             optionsArgument: { elementSelector: elementSelector, model: model }
        }).start();
        Ribs.parseMixinDefinitions([
            { createTestMixin1: { model: model, elementSelector: elementSelector } }
        ]);
    });

    describe("Exception throwing", function () {
        var exceptionThrown;

        beforeEach(function() {
            exceptionThrown = false;
        });

        afterEach(function () {
            if (!exceptionThrown) {
                throw "No exception was thrown";
            }
        });

        it("Should throw error on unknown mixin", function () {
            try {
                Ribs.parseMixinDefinitions([
                    { nonExistingMixin: {} }
                ]);
            } catch (e) {
                exceptionThrown = true;
            }
        });
    });
});