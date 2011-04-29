var CallStack = function () {
        var expectedCallStack = [];

        this.expectCall = function (methodName) {
            expectedCallStack.splice(0, 0, methodName);
        };

        this.expectFinished = function () {
            if (expectedCallStack.length > 0) {
                throw "No call to " + _.last(expectedCallStack);
            }
        };

        this.called = function (method) {
            if (expectedCallStack.length == 0) {
                throw "Did not expect a function call, but got " + method;
            } else if (method !== _.last(expectedCallStack)) {
                throw "Expected call to " + _.last(expectedCallStack) + ", but got " + method;
            } else {
                expectedCallStack.pop();
            }
        };
    },
    objectCallObserver = function (target) {
        var callStack = new CallStack;
        _.each(target, function (method, name) {
            if (typeof(method) == "function") {
                target[name] = function () {
                    callStack.called(name);
                    method.apply(target, arguments);
                };
            }
        });
        return callStack;
    },
    backboneSingleViewPrototypeObserver = function (View) {
        var ObservableView = View.extend({}),
            callStack = new CallStack();

        _.each(View.prototype, function (method, name) {
            if (typeof(method) == "method") {
                var oldMethod = View.prototype[name];
                ObservableView.prototype[name] = function () {
                    callStack.called(name);
                    oldMethod.apply(this, arguments);
                };
            }
        });
        return { ObservableView: ObservableView, callStack: callStack };
    };