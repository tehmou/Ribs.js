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
        var mixinDefinitions1 = [
                { createTestMixin1: {} }
            ],
            mixinDefinitions2 = [
                { createTestMixin1: {} },
                { createTestMixin2: {} }
            ],
            expectedDef1Calls = [
                { name: "createTestMixin1", optionsArgument: {} }
            ],
            expectedDef2Calls = [
                { name: "createTestMixin1", optionsArgument: {} },
                { name: "createTestMixin2", optionsArgument: {} }
            ];

        callStack
                .expectCalls([
                    {
                        name: "mixinComposite",
                        optionsArgument: { elementSelector: "", mixins: mixinDefinitions1 }
                    }
                ])
                .expectCalls(expectedDef1Calls)
                .expectCall({
                    name: "mixinComposite",
                    optionsArgument: { elementSelector: ".my-class", mixins: mixinDefinitions2 }
                })
                .expectCalls(expectedDef2Calls)
                .expectCall("mixinComposite")
                .expectCall({
                    name: "mixinComposite",
                    optionsArgument: { elementSelector: ".my-third-class", mixins: mixinDefinitions1 }
                })
                .expectCalls(expectedDef1Calls);

        mixins = Ribs.parseMixinDefinitions({
            "": mixinDefinitions1,
            ".my-class": mixinDefinitions2,
            ".my-second-class": {
                ".my-third-class": mixinDefinitions1
            }
        });
    });
});