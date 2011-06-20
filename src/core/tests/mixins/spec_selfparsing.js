describe("Ribs.mixins.support.selfParsing", function () {
    var mixin, parser, def, composite, customMixin;

    beforeEach(function () {
        mixin = _.clone(Ribs.mixins.support.selfParsing);
        customMixin = {};
        parser = Ribs.utils.createMixinDefinitionParser({
            mixinLibrary: {
                plain: { param1: "foo"},
                composite: Ribs.mixins.composite,
                customNameSpace: {
                    actualMixin: customMixin
                }
            }
        });
    });

    describe("Parsing an array", function () {
        beforeEach(function () {
            def = [
                { plain: { elementSelector: ".mySel" }},
                { plain: { param1: "testparam" }},
                { plain: {}}
            ];
            composite = _.clone(Ribs.mixins.support.composite);
            parser.createCompositeFromDefinitions({
                mixinDefinitions: def,
                composite: composite
            });
        });

        it("Should consider elements of an array as mixins", function () {
            expect(composite).toHaveNumberOfMixinClasses(def.length);
        });

        it("Should consider the key in a mixin definition as the base, and the value as the overrides", function () {
            expect(composite.mixinClasses[0].elementSelector).toEqual(".mySel");
            expect(composite.mixinClasses[1].param1).toEqual("testparam");
            expect(composite.mixinClasses[2].param1).toEqual("foo");
        });
    });

    describe("Parsing an object", function () {
        beforeEach(function () {
            def = {
                "": [],
                "elementOne": [],
                "myEl": []
            };
            composite = parser.createCompositeFromDefinitions({ mixinDefinitions: def });
        });

        it("Should be able to read elementSelector from the high level object keys", function () {
            expect(composite).toContainOneMixinWithElementSelector("");
            expect(composite).toContainOneMixinWithElementSelector("elementOne");
            expect(composite).toContainOneMixinWithElementSelector("myEl");
            expect(composite).toHaveNumberOfMixinClasses(3);
        });
    });

    describe("Parsing an object with nested namespace", function () {
        beforeEach(function () {
            def = [{"customNameSpace.actualMixin": {}}];
            composite = parser.createCompositeFromDefinitions({ mixinDefinitions: def });
        });

        it("Should find the nested mixins", function () {
            expect(composite.mixinClasses[0]).toEqual(customMixin);
        });
    });
});