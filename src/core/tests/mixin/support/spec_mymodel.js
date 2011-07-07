describe("Ribs.mixins.support.modelChooser", function () {
    var mixin, callStack, testModel;

    beforeEach(function () {
        mixin = Ribs.compose("support.modelChooser", {
            modelName: "testModel",
            myModelAdded: function () { },
            myModelRemoved: function () { }
        });
        testModel = {};
        callStack = objectCallObserver(mixin);
        callStack.start();
    });

    afterEach(function () {
        callStack.expectFinished();
    });

    it("Should call myModelAdded when adding the named model", function () {
        callStack.expectCalls([
            "modelAdded",
            { name: "modelAdded", arguments: ["testModel", testModel] },
            { name: "myModelAdded", arguments: [testModel] }
        ]);
        mixin.modelAdded("noMatch", {});
        mixin.modelAdded("testModel", testModel);
    });

    it("Should call myModelRemoved when removing the named model", function () {
        callStack.expectCalls([
            "modelRemoved",
            { name: "modelRemoved", arguments: ["testModel", testModel] },
            { name: "myModelRemoved", arguments: [testModel] }
        ]);
        mixin.modelRemoved("noMatch", {});
        mixin.modelRemoved("testModel", testModel);
    });
});