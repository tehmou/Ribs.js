describe("parseMixinDefinitions", function () {
    var callStack;

    beforeEach(function () {
        Ribs.mixins = {
            createTestMixin1: function () { return this; },
            createTestMixin2: function () { return this; }
        };
        callStack = objectCallObserver(Ribs.mixins);
    });

    afterEach(function () {
        delete Ribs.mixins;
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

    it("Should throw error on unknown mixin", function () {
        var exceptionThrown;
        try {
            Ribs.parseMixinDefinitions([
                { nonExistingMixin: {} }
            ]);
        } catch (e) {
            exceptionThrown = true;
        }
        expect(exceptionThrown).toBeTruthy();
    });
});