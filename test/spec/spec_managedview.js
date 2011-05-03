describe("ManagedView", function () {
    var ObservableManagedView, callStack;

    beforeEach(function () {
        var o = typeCallObserver(Ribs.ManagedView);
        ObservableManagedView = o.ObservableType;
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
            var model = new Backbone.Model(), el = $("div");
            callStack.expectCalls([
                "initialize",
                "bindToModel",
                "modelChanging",
                { name: "modelChanged", arguments: [model] },
                "customInitialize",
                "render",
                "unbindEvents",
                { name: "redraw", arguments: [el] },
                "refresh",
                "bindEvents"
            ]);
            callStack.start();
            new ObservableManagedView({ model: model, el: el });
        });
    });

    describe("Basic functionality", function () {
        var managedView;

        beforeEach(function () {
            managedView = new ObservableManagedView();
            callStack.start();
        });

        it("Should only redraw first time rendering", function () {
            callStack.expectCalls([
                "render",
                "unbindEvents",
                "refresh",
                "bindEvents"
            ]);
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
            managedView.render();
        });

        describe("Model", function () {
            var model;

            beforeEach(function () {
                model = new Backbone.Model();
            });

            it("Should trigger modelChanging and modelChanged when calling bindToModel", function () {
                callStack.expectCalls([
                    "bindToModel",
                    "modelChanging",
                    { name: "modelChanged", arguments: [model]}
                ]);
                managedView.bindToModel(model);
            });

            it("Should augment the model with ribsUI property", function () {
                callStack.pause();
                expect(model.hasOwnProperty("ribsUI")).toBeFalsy();
                managedView.bindToModel(model);
                expect(model.hasOwnProperty("ribsUI")).toBeTruthy();
            });
        });
    });
});