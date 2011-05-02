describe("ManagedView", function () {
    var ObservableManagedView, callStack;

    beforeEach(function () {
        var o = backboneSingleViewPrototypeObserver(Ribs.ManagedView);
        ObservableManagedView = o.ObservableView;
        callStack = o.callStack;
    });

    it("Should initialize in proper order", function () {
        callStack.expectCalls([
            "initialize",
            "customInitialize",
            "render",
            "unbindEvents",
            "redraw",
            "refresh",
            "bindEvents"
        ]);
        callStack.start();
        new ObservableManagedView();
        callStack.expectFinished();
    });

    describe("Rendering", function () {
        var managedView;

        beforeEach(function () {
            managedView = new ObservableManagedView();
        });
        
        it("Should only redraw first time rendering", function () {
            callStack.expectCalls([
                "render",
                "unbindEvents",
                "refresh",
                "bindEvents"
            ]);
            callStack.start();
            managedView.render();
            callStack.expectFinished();
        });

        it("Should redraw again if invalidated is set to true", function () {
            managedView.invalidated = true;
            callStack.expectCalls([
                "render",
                "unbindEvents",
                "redraw",
                "refresh",
                "bindEvents"
            ]);
            callStack.start();
            managedView.render();
            callStack.expectFinished();
        });
    });
});