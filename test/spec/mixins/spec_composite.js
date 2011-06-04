describe("Ribs.mixinBase.composite", function () {
    var composite, pivot, inheritingMethods, mixin1, mixin2;

    beforeEach(function () {
        pivot = {};
        inheritingMethods = [ "call1", "call2" ];
        mixin1 = {
            elementSelector: "mixinSelector",
            call1: function () { }, call2: function () { }
        };
        mixin2 = { myParam: "myValue" };

        composite = _.extend({}, Ribs.mixinBase.composite, {
            pivot: pivot,
            inheritingMethods: inheritingMethods,
            mixinClasses: [ mixin1, mixin2 ],
            testMethod: function () { }
        });
    });

    it("Should act as a type if cloned and not conflict", function () {
        var composite2 = _.clone(composite);
        expect(composite.mixins).toBeUndefined();
        expect(composite2.mixins).toBeUndefined();
        composite2.mixinInitialize();
        expect(composite.mixins).toBeUndefined();
        expect(composite2.mixins.length).toEqual(2);
    });

    it("Should create clones of all its mixinClasses", function () {
        composite.mixinInitialize();

        expect(composite.mixins[0].elementSelector).toEqual("mixinSelector");
        expect(composite.mixins[0]).not.toEqual(mixin1);
        expect(composite.mixins[1].myParam).toEqual("myValue");
        expect(composite.mixins[1]).not.toEqual(mixin2);
    });

    it("Should delegate all calls defined inheritingMethods to the created mixins", function () {
        composite.mixinInitialize();

        var mixin = composite.mixins[0],
            callStack = objectCallObserver(mixin);

        callStack.expectCalls(["call1", "call2"]);
        callStack.start();

        composite.call1();
        composite.testMethod();
        composite.call2();

        callStack.expectFinished();
    });

    it("Should pass inheritingMethods and pivot to created mixins", function () {
         composite.mixinInitialize();

        expect(composite.mixinClasses[0].inheritingMethods).toBeUndefined();
        expect(composite.mixinClasses[0].pivot).toBeUndefined();
        expect(composite.mixinClasses[1].inheritingMethods).toBeUndefined();
        expect(composite.mixinClasses[1].pivot).toBeUndefined();

        expect(composite.mixins[0].inheritingMethods).toEqual(inheritingMethods);
        expect(composite.mixins[0].pivot).toEqual(pivot);
        expect(composite.mixins[1].inheritingMethods).toEqual(inheritingMethods);
        expect(composite.mixins[1].pivot).toEqual(pivot);
    });
});