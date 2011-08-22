describe("Ribs.mixins.support.rendering.renderChain", function () {
    var renderChain, renderTarget;

    beforeEach(function () {
        renderChain = Ribs.compose(
                "support.parent",
                "support.rendering.renderChain",
                { initialized: true }
            );
        renderTarget = {
            render: function () {},
            unbindEvents: function () {},
            redraw: function () {},
            bindEvents: function () {},
            refresh: function () {}
        };
        renderChain.children = [ renderTarget ];
    });

    describe("Function calls", function () {
        var callStack, renderWithRedrawCallStack, renderWithoutRedrawCallStack;

        beforeEach(function () {
            callStack = objectCallObserver(renderTarget);
            renderWithRedrawCallStack = [
                "unbindEvents",
                "redraw",
                "render",
                "bindEvents"
            ];
            renderWithoutRedrawCallStack = [
                "render"
            ];
        });

        afterEach(function () {
            callStack.expectFinished();
        });

        it("Should not render at all if initialized is false", function () {
            renderChain.initialized = false;
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