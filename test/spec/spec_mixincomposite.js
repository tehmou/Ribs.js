describe("MixinComposite", function () {
    
    beforeEach(function () {
        Ribs.mixins.createTestMixin1 = function () { return function () { }; };
        Ribs.mixins.createTestMixin2 = function () { return function () { }; };
    });

    describe("Parsing of definitions into MixinComposites", function () {
        var oldMixins, callStack;

        beforeEach(function () {
            oldMixins = Ribs.mixins;
            Ribs.mixins = _.extend({}, Ribs.mixins);
            callStack = objectCallObserver(Ribs.mixins);
            callStack.start();
        });

        afterEach(function () {
            callStack.expectFinished();
            callStack.pause();
            Ribs.mixins = oldMixins;
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

            Ribs.parseMixinDefinitions({
                "": mixinDefinitions1,
                ".my-class": mixinDefinitions2,
                ".my-second-class": {
                    ".my-third-class": mixinDefinitions1
                }
            });
        });
    });

    describe("DOM behavior", function () {
        var rootEl, classSpecialEl, classVerySpecialEl, anotherClassVerySpecialEl;

        beforeEach(function () {
            rootEl = $("<div></div>");
            classSpecialEl = $("<div class=\"special\"></div>");
            classVerySpecialEl = $("<div class=\"very-special\"></div>");
            anotherClassVerySpecialEl = $("<div class=\"very-special\"></div>");

            $(classSpecialEl).append(classVerySpecialEl);
            $(rootEl)
                    .append(anotherClassVerySpecialEl)
                    .append(classSpecialEl);
        });

        it("Should give each mixin the proper el for redrawing", function () {
            var view, View = Ribs.createMixed({
                mixins: {
                    "":  { createTestMixin1: { } },
                    ".special": [
                        { createTestMixin2: { } }
                    ],
                    ".special .very-special": [
                        { createTestMixin1: { } }
                    ]
                }
            });
            view = new View({ el: rootEl });

            // Sanity check of Backbone.View
            expect(view.el.length).toEqual(1);
            expect(view.el[0]).toEqual(rootEl[0]);

            // Make sure the proper elements were given to mixins
            expect(view.rootMixin.el[0]).toEqual(rootEl[0]);
            expect(view.rootMixin.mixins.length).toEqual(3);
            expect(view.rootMixin.mixins[0].el.length).toEqual(1);
            expect(view.rootMixin.mixins[0].el[0]).toEqual(rootEl[0]);
            expect(view.rootMixin.mixins[1].el.length).toEqual(1);
            expect(view.rootMixin.mixins[1].el[0]).toEqual(classSpecialEl[0]);
            expect(view.rootMixin.mixins[2].el.length).toEqual(1);
            expect(view.rootMixin.mixins[2].el[0]).toEqual(classVerySpecialEl[0]);
        });
    });
});