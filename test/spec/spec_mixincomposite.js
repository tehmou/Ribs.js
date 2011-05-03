describe("MixinComposite", function () {
    var callStack;

    beforeEach(function () {
        Ribs.mixins.createTestMixin1 = function () { return this; };
        Ribs.mixins.createTestMixin2 = function () { return this; };
        callStack = objectCallObserver(Ribs.mixins);
        callStack.start();
    });

    afterEach(function () {
        callStack.expectFinished();
    });

    it("Should know how to parse element definitions", function () {
        callStack.expectCalls([
            { name: "mixinComposite" },
            { name: "createTestMixin1", optionsArgument: {} },
            { name: "mixinComposite" },
            { name: "createTestMixin1", optionsArgument: {} },
            { name: "createTestMixin2", optionsArgument: {} }
        ]);
        Ribs.parseMixinDefinitions({
            "": [
                { createTestMixin1: {} }
            ],
            ".my-class": [
                { createTestMixin1: {} },
                { createTestMixin2: {} }
            ]
        });
    });
});