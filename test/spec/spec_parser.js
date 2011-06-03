describe("Ribs.mixinBase.selfParsing", function () {
    var mixin, parser, def, composite;

    beforeEach(function () {
        mixin = _.clone(Ribs.mixinBase.selfParsing);
        parser = Ribs.createMixinDefinitionParser({
            mixinLibrary: {
                plain: { param1: "foo"},
                composite: Ribs.mixinBase.composite
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
            composite = _.clone(Ribs.mixinBase.composite);
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
});