describe("ManagedView", function () {
    var ObservableManagedView, callStack;

    beforeEach(function () {
        var o = backboneSingleViewPrototypeObserver(Ribs.ManagedView);
        ObservableManagedView = o.ObservableView;
        callStack = o.callStack;
    });

    afterEach(function () {
        callStack.expectFinished();
    });

    describe("Initialization", function () {
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
        });

        it("Should trigger bindToModel if model is provided to constructor", function() {
            var model = new Backbone.Model();
            callStack.expectCalls([
                "initialize",
                "bindToModel",
                "modelChanging",
                "modelChanged",
                "customInitialize",
                "render",
                "unbindEvents",
                "redraw",
                "refresh",
                "bindEvents"
            ]);
            callStack.start();
            new ObservableManagedView({ model: model });
        });
    });

    describe("Basic functionality", function () {
        var managedView;

        beforeEach(function () {
            managedView = new ObservableManagedView();
        });

        describe("Rendering", function () {
            it("Should only redraw first time rendering", function () {
                callStack.expectCalls([
                    "render",
                    "unbindEvents",
                    "refresh",
                    "bindEvents"
                ]);
                callStack.start();
                managedView.render();
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
            });
        });

        describe("Model", function () {
            it("Should trigger modelChanging and modelChanged when calling bindToModel", function () {
                callStack.expectCalls([
                    "bindToModel",
                    "modelChanging",
                    "modelChanged"
                ]);
                callStack.start();
                managedView.bindToModel();
            });
        });
    });        
});