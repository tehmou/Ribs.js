describe("Ribs.support.mixins.deferredRender", function () {
    var mixin, callStack;

    beforeEach(function () {
        mixin = _.extend({}, Ribs.support.mixins.deferredRender);
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