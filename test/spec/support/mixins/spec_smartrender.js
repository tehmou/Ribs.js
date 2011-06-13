describe("Ribs.support.mixins.smartRender", function () {
    var mixin, callStack;

    beforeEach(function () {
        mixin = _.extend({}, Ribs.support.mixins.smartRender);
        callStack = objectCallObserver(mixin);
    });

    it("Should only call render once after nested render requests", function () {
        mixin.requestRender();
        mixin.requestRender();
        mixin.requestInvalidate();
        mixin.requestRender();
        callStack.start();
        callStack.expectCall("render");
        mixin.flushRequests();
        callStack.expectFinished();
    });
});