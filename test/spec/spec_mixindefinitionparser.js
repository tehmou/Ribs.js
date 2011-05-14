describe("mixinDefinitionParser", function () {
    var parser;

    beforeEach(function () {
        parser = Ribs.createMixinDefinitionParser(function () { return function () {}; });
    });

    describe("Parsing of definitions", function () {
        var callStack, o;

        beforeEach(function () {
            o = {};
            callStack = objectCallObserver(parser);
            callStack.start();
        });

        afterEach(function () {
            callStack.expectFinished();
            callStack.pause();
        });

        it("Should try to create appropriate mixins from Array", function () {
            callStack.expectCalls([
                { name: "createMixinFromDefinitions" },
                { name: "parseOne", arguments: [o, "createTestMixin1"] },
                { name: "parseOne", arguments: [o, "createTestMixin2"] }
            ]);

            var Mixin = parser.createMixinFromDefinitions([
                { createTestMixin1: o },
                { createTestMixin2: o }
            ]);
            expect(Mixin.prototype.mixinClasses.length).toEqual(2);
        });

        it("Should know how to parse element definitions", function () {
            var mixinDefinitions1 = [
                    { createTestMixin1: o }
                ],
                mixinDefinitions2 = [
                    { createTestMixin1: o },
                    { createTestMixin2: o }
                ],
                mixinDefinitions3 = {
                        ".my-third-class": mixinDefinitions1
                },
                mixinDefinitions = {
                    "": mixinDefinitions1,
                    ".my-class": mixinDefinitions2,
                    ".my-second-class": mixinDefinitions3
                },
                expectedDef1Calls = [
                    { name: "parseOne", arguments: [o, "createTestMixin1"] }
                ],
                expectedDef2Calls = [
                    { name: "parseOne", arguments: [o, "createTestMixin1"] },
                    { name: "parseOne", arguments: [o, "createTestMixin2"] }
                ];

            callStack
                    .expectCall({ name: "createMixinFromDefinitions", arguments: [mixinDefinitions] })
                    .expectCall({ name: "createMixinFromDefinitions", arguments: [mixinDefinitions1, ""] })
                    .expectCalls(expectedDef1Calls)
                    .expectCall({ name: "createMixinFromDefinitions", arguments: [mixinDefinitions2, ".my-class"] })
                    .expectCalls(expectedDef2Calls)
                    .expectCall({ name: "createMixinFromDefinitions", arguments: [mixinDefinitions3, ".my-second-class"] })
                    .expectCall({ name: "createMixinFromDefinitions", arguments: [mixinDefinitions1, ".my-third-class"] })
                    .expectCalls(expectedDef1Calls);

            var Mixin = parser.createMixinFromDefinitions(mixinDefinitions);
            expect(Mixin.prototype.mixinClasses.length).toEqual(3);
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
            var mixin,
                Mixin = parser.createMixinFromDefinitions({
                    "":  [
                        { createTestMixin1: { } }
                    ],
                    ".special": [
                        { createTestMixin2: { } }
                    ],
                    ".special .very-special": [
                        { createTestMixin1: { } }
                    ]
                });
            
            expect(Mixin.prototype.mixinClasses.length).toEqual(3);

            mixin = new Mixin();
            mixin.customInitialize();
            mixin.redraw(rootEl);

            // Make sure the proper elements were given to mixins
            expect(mixin.el[0]).toEqual(rootEl[0]);
            expect(mixin.mixins.length).toEqual(3);
            expect(mixin.mixins[0].el.length).toEqual(1);
            expect(mixin.mixins[0].el[0]).toEqual(rootEl[0]);
            expect(mixin.mixins[1].el.length).toEqual(1);
            expect(mixin.mixins[1].el[0]).toEqual(classSpecialEl[0]);
            expect(mixin.mixins[2].el.length).toEqual(1);
            expect(mixin.mixins[2].el[0]).toEqual(classVerySpecialEl[0]);
        });
    });
});