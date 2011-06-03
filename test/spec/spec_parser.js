describe("Ribs.mixinBase.selfParsing", function () {
    var mixin, parser;

    beforeEach(function () {
        mixin = _.clone(Ribs.mixinBase.selfParsing);
        parser = Ribs.createMixinDefinitionParser({
            mixinLibrary: {
                plain: {},
                composite: Ribs.mixinBase.composite
            }
        });
    });

    it("Should consider elements of an array as mixins", function () {
        var def = [
                { plain: { elementSelector: ".mySel" }},
                { plain: { param1: "testparam" }},
                { plain: {}}
            ],
            composite = _.clone(Ribs.mixinBase.composite);

        parser.createCompositeFromDefinitions({
            mixinDefinitions: def,
            composite: composite
        });

        expect(composite.mixinClasses[0].elementSelector).toEqual(".mySel");
        expect(composite.mixinClasses[1].param1).toEqual("testparam");
        expect(composite).toHaveNumberOfMixinClasses(def.length);
    });

    it("Should be able to read elementSelector from the high level object keys", function () {
        var def = {
                "": [],
                "elementOne": [],
                "myEl": []
            },
            composite = parser.createCompositeFromDefinitions({ mixinDefinitions: def });


        expect(composite).toContainOneMixinWithElementSelector("");
        expect(composite).toContainOneMixinWithElementSelector("elementOne");
        expect(composite).toContainOneMixinWithElementSelector("myEl");
        expect(composite).toHaveNumberOfMixinClasses(3);
    });

    it("Should consider the key in a mixin definition as the base, and the value as the overrides", function () {

    });
});