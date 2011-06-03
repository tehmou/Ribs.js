describe("Ribs.mixinBase.selfParsing", function () {
    var mixin, parser;

    beforeEach(function () {
        mixin = _.clone(Ribs.mixinBase.selfParsing);
        parser = Ribs.createMixinDefinitionParser({
            mixinLibrary: {
                composite: Ribs.mixinBase.composite
            }
        });
    });

    it("Should consider elements of an array as mixins", function () {
        
    });

    it("Should place the parsed mixinClasses into the given parameter mixin", function () {

    });

    it("Should be able to read elementSelector from the high level object keys", function () {
        var def = {
                "": [],
                "elementOne": [],
                "myEl": []
            },
            composite = parser.createCompositeFromDefinitions({ mixinDefinitions: def });
        var numExpectedMixins = 0;
        _.each(def, function (defValue, defKey) {
            var found = false;
            _.each(composite.mixinClasses, function (realValue) {
                if (realValue.elementSelector === defKey) {
                    found = true;
                }
            });
            if (!found) {
                throw "Could not find a mixin with the selector '" + defKey + "'";
            }
            numExpectedMixins++;
        });

        var numCreatedMixins = composite.mixinClasses.length;
        if (numCreatedMixins !== numExpectedMixins) {
            throw "Found wrong number of mixins in the composite (" + numCreatedMixins + "/" + numExpectedMixins + ")";
        }
    });

    it("Should consider the key in a mixin definition as the base, and the value as the overrides", function () {

    });
});