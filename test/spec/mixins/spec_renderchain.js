define("Ribs.mixinBase.renderChain", function () {
    var renderChain;

    beforeEach(function () {
        renderChain = _.clone(Ribs.mixinBase.renderChain);
    });

    if("Should add inheritingMethods", function () {
        expect(renderChain.inheritingMethods.length).toEqual(0);
        renderChain.mixinInitialize();
        expect(renderChain.inheritingMethods).toEqual([
            "unbindEvents", "bindEvents", "redraw", "refresh", "hide", "dispose"
        ]);
    });

    describe("Function calls", function () {
        var callStack, renderWithRedrawCallStack, renderWithoutRedrawCallStack;

        beforeEach(function () {
            renderChain.initialized = true;
            callStack = objectCallObserver(renderChain);
            callStack.start();
            renderWithRedrawCallStack = [
                "render",
                "unbindEvents",
                "redraw",
                "refresh",
                "bindEvents"
            ];
            renderWithoutRedrawCallStack = [
                "render",
                "unbindEvents",
                "refresh",
                "bindEvents"
            ];
        });

        afterEach(function () {
            callStack.expectFinished();
        });

        it("Should not render at all if initialized is false", function () {
            renderChain.initialized = false;
            renderChain.render();
        });

        it("Should redraw on first render()", function () {
            callObserver.expectCalls(renderWithRedrawCallStack);
            renderChain.render();
        });

        it("Should not redraw on the second time rendering", function () {
            renderChain.render();
            callObserver.expectCalls(renderWithoutRedrawCallStack);
            renderChain.render();
        });

        it("Should redraw if invalidated is set to true", function () {
            renderChain.render();
            renderChain.invalidated = true;
            callObserver.expectCalls(renderWithRedrawCallStack);
            renderChain.render();
        });
    });        
});