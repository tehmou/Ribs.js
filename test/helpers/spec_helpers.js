describe("Testing helpers", function () {
    var callStack;

    describe("CallStack", function () {
        beforeEach(function () {
            callStack = new CallStack();
            callStack.start();
        });

        it("Should expect calls", function () {
            callStack.expectCall("function1");
            callStack.called("function1");
            callStack.expectFinished();
        });

        it("Should expect multiple calls in right order", function () {
            callStack.expectCalls([
                "function1",
                "function2",
                "function3"
            ]);
            callStack.called("function1");
            callStack.called("function2");
            callStack.called("function3");
            callStack.expectFinished();
        });

        it("Should check arguments", function () {
            var arg1 = {};
            callStack.expectCalls([
                { name: "f", arguments: ["foo", arg1] }
            ]);
            callStack.called("f", ["foo", arg1]);
            callStack.expectFinished();
        });

        describe("Exception throwing", function () {
            var gotException;

            beforeEach(function () {
                gotException = false;
            });

            afterEach(function () {
                if (!gotException) {
                    throw "No exception was thrown";
                }
            });

            it("Should throw error if not all calls were made", function () {
                callStack.expectCalls(["function1","function2"]);
                callStack.called("function1");
                try {
                    callStack.expectFinished();
                } catch (e) {
                    gotException = true;
                }
            });

            it("Should throw error if wrong function was called", function () {
                callStack.expectCall("function1");
                try {
                    callStack.called("function2");
                } catch (e) {
                    gotException = true;
                }
            });

            it("Should throw error if function was called with wrong arguments", function () {
                callStack.expectCall({ name: "function1", arguments: ["ewrnsu"] });
                try {
                    callStack.called("function1", ["autcr"]);
                } catch (e) {
                    gotException = true;
                }
            });

            it("Should throw error if call order is wrong", function () {
                callStack.expectCalls([
                    "function1",
                    "function2",
                    "function3"
                ]);
                try {
                    callStack.called("function1");
                    callStack.called("function3");
                    callStack.called("function2");
                } catch (e) {
                    gotException = true;
                }
            });
        });
    });

    describe("objectCallObserver", function () {
        var object;

        beforeEach(function () {
            object = {
                testFunction1: function () { },
                testFunction2: function () { }
            };
            callStack = objectCallObserver(object);
            callStack.start();
        });

        it("Should observe calls", function () {
            callStack.expectCall("testFunction1");
            callStack.expectCall("testFunction2");
            object.testFunction1();
            object.testFunction2();
            callStack.expectFinished();
        });

        describe("Argument handling", function () {
            var arguments1, arguments2;

            beforeEach(function () {
                arguments1 = { key: "value" };
                arguments2 = ["myval", "myval2"];
            });

            it("Should observe calls with arguments", function () {
                callStack.expectCall({ name: "testFunction1", arguments: [] });
                callStack.expectCall({ name: "testFunction1", arguments: ["foo", "bar", "test"] });
                callStack.expectCall({ name: "testFunction2", arguments: [arguments1, arguments2] });
                object.testFunction1();
                object.testFunction1("foo", "bar", "test");
                object.testFunction2(arguments1, arguments2);
                callStack.expectFinished();
            });
        });

        describe("Exception throwing", function () {
            var gotException;

            beforeEach(function () {
                gotException = false;
            });

            afterEach(function () {
                if (!gotException) {
                    throw "No exception was thrown";
                }
            });

            it("Should throw error when wrong function is called", function () {
                callStack.expectCall(["lorem"]);
                try {
                    object.testFunction1();
                } catch (e) {
                    gotException = true;
                }
            });

            it("Should throw error when function is called with wrong arguments", function () {
                callStack.expectCall({ name: "testFunction1", arguments: ["foo", "bar"] });
                try {
                    object.testFunction1("bar", "foo");
                } catch (e) {
                    gotException = true;
                }
            });
        });
    });
});