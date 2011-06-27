describe("Ribs.mixins.support.deferredRender", function () {
    var mixin, callStack;

    beforeEach(function () {
        mixin = Ribs.compose("support.deferredRender", { render: function () { } });
        callStack = objectCallObserver(mixin);
    });

    it("Should only call render once after nested render requests", function () {
        callStack.start();
        callStack.expectCalls(["requestRender", "requestRender", "requestInvalidate", "requestRender"]);
        mixin.requestRender();
        mixin.requestRender();
        mixin.requestInvalidate();
        callStack.expectFinished();

        callStack.expectCalls(["flushRequests", "render"]);
        mixin.flushRequests();
        callStack.expectFinished();
    });
});