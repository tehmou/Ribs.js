describe("Ribs.support.mixins.pivotEl", function () {
    var pivotEl;

    beforeEach(function () {
        pivotEl = _.clone(Ribs.support.mixins.pivotEl);
    });

    it("Should be uninitialized by default", function () {
        pivotEl.mixinInitialize();
        expect(pivotEl.initialized).toBeFalsy();
    });

    it("Should create an empty div by default", function () {
        pivotEl.mixinInitialize();
        expect(pivotEl.el.nodeName.toLowerCase()).toEqual("div");
    });

    it("Should accept tagName and create the element according to it", function () {
        pivotEl.tagName = "p";
        pivotEl.mixinInitialize();
        expect(pivotEl.el.nodeName.toLowerCase()).toEqual("p");
    });
});