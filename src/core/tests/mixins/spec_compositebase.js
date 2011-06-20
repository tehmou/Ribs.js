describe("Ribs.mixins.support.compositeBase", function () {
    var composite, pivot, randomProp, mixin1, mixin2;

    beforeEach(function () {
        pivot = {};
        randomProp = [ "call1", "call2" ];
        mixin1 = {
            elementSelector: "mixinSelector",
            call1: function () { }, call2: function () { }
        };
        mixin2 = { myParam: "myValue" };

        composite = _.extend({}, Ribs.mixins.support.compositeBase, {
            pivot: pivot,
            randomProp: randomProp,
            mixinClasses: [ mixin1, mixin2 ],
            testMethod: function () { }
        });
    });

    it("Should act as a type if cloned and not conflict", function () {
        var composite2 = _.clone(composite);
        expect(composite.children).toBeUndefined();
        expect(composite2.children).toBeUndefined();
        composite2.mixinInitialize();
        expect(composite.children).toBeUndefined();
        expect(composite2.children.length).toEqual(2);
    });

    it("Should create clones of all its mixinClasses", function () {
        composite.mixinInitialize();

        expect(composite.children[0].elementSelector).toEqual("mixinSelector");
        expect(composite.children[0]).not.toEqual(mixin1);
        expect(composite.children[1].myParam).toEqual("myValue");
        expect(composite.children[1]).not.toEqual(mixin2);
    });

    it("Should pass randomProp and pivot to created mixins", function () {
         composite.mixinInitialize();

        expect(composite.mixinClasses[0].inheritingMethods).toBeUndefined();
        expect(composite.mixinClasses[0].pivot).toBeUndefined();
        expect(composite.mixinClasses[1].inheritingMethods).toBeUndefined();
        expect(composite.mixinClasses[1].pivot).toBeUndefined();

        expect(composite.children[0].randomProp).toEqual(randomProp);
        expect(composite.children[0].pivot).toEqual(pivot);
        expect(composite.children[1].randomProp).toEqual(randomProp);
        expect(composite.children[1].pivot).toEqual(pivot);
    });
});