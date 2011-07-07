describe("Ribs.compose", function () {
    var obj;

    beforeEach(function () {
        obj = { a: "1", b: "2", c: "3", e: ["firstItem", "secondItem"] };
    });

    it("Should create a new instance and leave the original one untouched", function () {
        var obj2 = Ribs.compose(obj);
        expect(obj2===obj).toBeFalsy();
    });

    it("Should replace properties from additional sources", function () {
        obj = Ribs.compose(obj, { a: "5", d: "2" });
        expect(obj.a).toEqual("5");
        expect(obj.b).toEqual("2");
        expect(obj.c).toEqual("3");
        expect(obj.d).toEqual("2");
    });

    it("Should throw an error when trying to replace an array with something else", function () {
        var errorThrown = false;
        try {
            obj = Ribs.compose(obj, { e: "Hello world" });
        } catch(e) {
            errorThrown = e === "addingExtendArrayWithNonArray";
        }
        expect(errorThrown).toBeTruthy();
    });

    it("Should add property if it does not exist", function () {
        var array = ["newArray"], object = {};
        obj = Ribs.compose(obj, { f: array, g: object });
        expect(obj.f).toEqual(array);
        expect(obj.g).toEqual(object);
    });

    it("Should concatenate arrays", function () {
        obj = Ribs.compose(obj, { e: ["thirdItem"] });
        expect(obj.e.length).toEqual(3);
        expect(obj.e[2]).toEqual("thirdItem");
    });

    it("Should throw an error when trying to replace a function with something else", function () {
        var errorThrown = false;
        obj.f = function () { };
        try {
            obj = Ribs.compose(obj, { f: null });
        } catch(e) {
            errorThrown = e === "addingExtendFunctionWithNonFunction";
        }
        expect(errorThrown).toBeTruthy();
    });

    it("Should call all replaced functions with right arguments", function () {
        doTest();
        Ribs.debug = true;
        doTest();
        delete Ribs.debug;

        function doTest () {
            var f1, f1Called, f2, f2Called, f3, f3Called, args = {};

            f1Called = false;
            f2Called = false;
            f3Called = false;

            f1 = function () {
                if (f1Called || f2Called || f3Called) {
                    throw "Wrong order in calling extended function (old one should be first).";
                }
                if (arguments[0] !== args) {
                    throw "Wrong arguments given for f1";
                }
                f1Called = true;
            };

            f2 = function () {
                if (f2Called || f3Called) {
                    throw "Wrong order in calling extended function (old one should be first).";
                }
                if (arguments[0] !== args) {
                    throw "Wrong arguments given for f2";
                }
                f2Called = true;
            };

            f3 = function () {
                if (f3Called) {
                    throw "Wrong order in calling extended function (old one should be first).";
                }
                if (arguments[0] !== args) {
                    throw "Wrong arguments given for f3";
                }
                f3Called = true;
            };

            obj.f = f1;
            obj = Ribs.compose(obj, { f: f2 }, { f: f3 });
            obj.f(args);
            expect(f1Called).toBeTruthy();
            expect(f2Called).toBeTruthy();
            expect(f3Called).toBeTruthy();
        }
    });
});

