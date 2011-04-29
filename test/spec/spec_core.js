describe("ManagedView", function () {
    var ObservableManagedView, callStack;

    beforeEach(function () {
        var o = backboneSingleViewPrototypeObserver(Ribs.ManagedView);
        ObservableManagedView = o.ObservableView;
        callStack = o.callStack;
    });

    it("Should do stuff", function () {
        callStack.expectCall("initialize");
        callStack.expectCall("customInitialize");
        callStack.expectCall("render");
        callStack.expectCall("unbindEvents");
        callStack.expectCall("redraw");
        callStack.expectCall("refresh");
        callStack.expectCall("bindEvents");
        var managedView = new ObservableManagedView();
    });
});