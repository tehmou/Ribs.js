describe("Ribs.utils.findObject", function () {
    var object, a, b, path;

    beforeEach(function () {
        a = {};
        b = {};
        object = {
            firstNS: {
                nameA: a
            },
            secondNS: {
                nestedNS: {
                    nameB: b
                }
            }
        };
    });

    it("Should find an object with dot notation", function () {
        var aLookup = "firstNS.nameA",
            bLookup = "secondNS.nestedNS.nameB";

        expect(Ribs.utils.findObject(object, aLookup)).toEqual(a);
        expect(Ribs.utils.findObject(object, bLookup)).toEqual(b);
    });
});