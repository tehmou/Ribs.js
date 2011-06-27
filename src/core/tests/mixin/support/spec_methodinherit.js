describe("Ribs.mixins.support.methodInherit", function () {
    var mixin, inheritingMethods, mixin1, mixin2;

    beforeEach(function () {
        inheritingMethods = [ "call1", "call2" ];
        mixin1 = {
            call1: function () { }, call2: function () { }
        };
        mixin2 = { myParam: "myValue" };

        mixin = Ribs.compose(
                "support.parent",
                "support.methodInherit", {
                    inheritingMethods: inheritingMethods,
                    children: [ mixin1, mixin2 ],
                    testMethod: function () { }
                });
            });

    it("Should delegate all calls defined inheritingMethods to the mixins", function () {
        mixin.mixinInitialize();

        var callStack = objectCallObserver(mixin1);

        callStack.expectCalls(["call1", "call2"]);
        callStack.start();

        mixin.call1();
        mixin.testMethod();
        mixin.call2();

        callStack.expectFinished();
    });

    it("Should not replace existing functions", function () {
        var called = false;
        mixin.call1 = function () { called = true; };
        mixin.mixinInitialize();
        mixin.call1();
        expect(called).toBeTruthy();
    });
});