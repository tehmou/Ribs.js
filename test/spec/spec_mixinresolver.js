describe("parseOneMixinDefinition", function () {
    var resolver, mixinLibrary, callStack;

    beforeEach(function () {
        mixinLibrary = {
            createTestMixin1: function () { return this; },
            createTestMixin2: function () { return this; }
        };
        resolver = Ribs.createMixinResolver(mixinLibrary);
        callStack = objectCallObserver(mixinLibrary);
    });

    afterEach(function () {
        callStack.expectFinished();
    });

    it("Should leave an inline mixin unchanged after 'new'", function () {
        var obj = {
                refresh: function () { },
                value: true
            },
            Obj2 = resolver(obj, "inline");
        expect(new Obj2()).toEqual(obj);
    });

    it("Should give mixins their creation arguments as options", function () {
        var elementSelector = "div", model = { myModel: true };
        callStack.expectCall({
             name: "createTestMixin1",
             optionsArgument: { elementSelector: elementSelector, model: model }
        }).start();
        resolver({ model: model, elementSelector: elementSelector }, "createTestMixin1");
    });

    describe("Exception throwing", function () {
        var exceptionThrown;

        beforeEach(function() {
            exceptionThrown = false;
        });

        afterEach(function () {
            if (!exceptionThrown) {
                throw "No exception was thrown";
            }
        });

        it("Should throw error on unknown mixin", function () {
            try {
                resolver({ }, "nonExistingMixin");
            } catch (e) {
                exceptionThrown = true;
            }
        });
    });
});