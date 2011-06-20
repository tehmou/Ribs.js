describe("Ribs.support.mixins.renderChain", function () {
    var renderChain;

    beforeEach(function () {
        renderChain = _.clone(Ribs.support.mixins.renderChain);
        renderChain.pivot = { initialized: true }
    });

    if("Should add inheritingMethods", function () {
        expect(renderChain.inheritingMethods.length).toEqual(4);
        renderChain.mixinInitialize();
        expect(renderChain.inheritingMethods).toEqual([
            "unbindEvents", "bindEvents", "redraw", "refresh", "hide", "dispose"
        ]);
    });

    describe("Function calls", function () {
        var callStack, renderWithRedrawCallStack, renderWithoutRedrawCallStack;

        beforeEach(function () {
            callStack = objectCallObserver(renderChain);
            renderWithRedrawCallStack = [
                "render",
                "unbindEvents",
                "redraw",
                "bindEvents",
                "refresh"
            ];
            renderWithoutRedrawCallStack = [
                "render",
                "refresh",
            ];
        });

        afterEach(function () {
            callStack.expectFinished();
        });

        it("Should not render at all if initialized is false", function () {
            callStack.expectCall("render");
            renderChain.pivot.initialized = false;
            callStack.start();
            renderChain.render();
        });

        it("Should redraw on first render()", function () {
            callStack.expectCalls(renderWithRedrawCallStack);
            callStack.start();
            renderChain.render();
        });

        it("Should not redraw on the second time rendering", function () {
            renderChain.render();
            callStack.expectCalls(renderWithoutRedrawCallStack);
            callStack.start();
            renderChain.render();
        });

        it("Should redraw if invalidated is set to true", function () {
            renderChain.render();
            renderChain.invalidated = true;
            callStack.expectCalls(renderWithRedrawCallStack);
            callStack.start();
            renderChain.render();
        });
    });        
});