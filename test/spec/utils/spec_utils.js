describe("Ribs.addingExtend", function () {
    var obj;

    beforeEach(function () {
        obj = { a: "1", b: "2", c: "3" };
    });

    it("Should replace properties from additional sources", function () {
        Ribs.addingExtend(obj, { a: "5", d: "2" });
        expect(obj.a).toEqual("5");
        expect(obj.b).toEqual("2");
        expect(obj.c).toEqual("3");
        expect(obj.d).toEqual("2");
    });

    it("Should throw an error when trying to replace a function with something else", function () {
        var errorThrown = false;
        obj.f = function () { };
        try {
            Ribs.addingExtend(obj, { f: null });
        } catch(e) {
            errorThrown = e === "Tried to override a function with non-function";
        }
        expect(errorThrown).toBeTruthy();
    });

    it("Should call all replaced functions", function () {
        var f1, f1Called, f2, f2Called;

        f1Called = false;
        f2Called = false;

        f1 = function () {
            if (f2Called) {
                throw "Wrong order in calling extended function (old one should be first).";
            }
            f1Called = true;
        };

        f2 = function () {
            f2Called = true;
        };
        
        obj.f = f1;
        Ribs.addingExtend(obj, { f: f2 });
        obj.f();
        expect(f1Called).toBeTruthy();
        expect(f2Called).toBeTruthy();
    });
});