describe("Ribs.support.mixins.element", function () {
    var mixin;

    beforeEach(function () {
        mixin = _.clone(Ribs.support.mixins.element);
    });

    it("Should be uninitialized by default", function () {
        mixin.mixinInitialize();
        expect(mixin.initialized).toBeFalsy();
    });

    it("Should create an empty div by default", function () {
        mixin.mixinInitialize();
        expect(mixin.el.nodeName.toLowerCase()).toEqual("div");
    });

    it("Should accept tagName and create the element according to it", function () {
        mixin.tagName = "p";
        mixin.mixinInitialize();
        expect(mixin.el.nodeName.toLowerCase()).toEqual("p");
    });
});