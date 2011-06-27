describe("Ribs.mixins.support.initializing", function () {
    var mixin;

    beforeEach(function () {
        mixin = Ribs.compose("support.initializing");
    });

    it("Should set initialized flag to true after mixinInitialize", function () {
        expect(mixin.initialized).toEqual(false);
        mixin.mixinInitialize();
        expect(mixin.initialized).toEqual(true);
    });

    it("Should not allow initializing twice", function () {
        var errorThrow = false;
        mixin.mixinInitialize();
        try {
            mixin.mixinInitialize();
        } catch (e) {
            errorThrow = true;
        }
        expect(errorThrow).toBeTruthy();
    });
});