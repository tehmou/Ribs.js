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
        var managedView = new ObservableManagedView();
        callStack.expectFinished();
    });

    it("Should only redraw first time rendering", function () {
        var managedView = new ObservableManagedView();
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
});