var CallStack = function () {
        var running = false,
            expectedCallStack = [];

        this.start = function () {
            running = true;
            return this;
        };

        this.pause = function () {
            running = false;
            return this;
        };

        this.expectCall = function (methodName) {
            expectedCallStack.splice(0, 0, methodName);
            return this;
        };

        this.expectCalls = function (methodNames) {
            _.each(methodNames, _.bind(function (methodName) {
                this.expectCall(methodName);
            }, this));
            return this;
        };

        this.expectFinished = function () {
            if (expectedCallStack.length > 0) {
                throw "No call to " + _.last(expectedCallStack);
            }
            return this;
        };

        this.called = function (methodName, arguments) {
            if (!running) { return; }

            var expectedMethod = _.last(expectedCallStack);
            if (expectedCallStack.length == 0) {
                throw "Did not expect a function call, but got " + methodName;
            } else if (typeof(expectedMethod) == "string") {
                if (methodName !== expectedMethod) {
                    throw "Expected call to " + _.last(expectedCallStack) + ", but got " + methodName;
                }
            } else {
                if (methodName !== expectedMethod.name) {
                    throw "Expected call to " + _.last(expectedCallStack) + ", but got " + methodName;
                }

                if (expectedMethod.arguments) {
                    // Validate arguments.
                    arguments = _.toArray(arguments);
                    _.each(expectedMethod.arguments, function (argument) {
                        var index = arguments.indexOf(argument);
                        if (index == -1) {
                            throw "Expected argument " + argument + " for call to " + methodName;
                        } else {
                            delete arguments[index];
                        }
                    });
                    if (expectedMethod.arguments.length > 0) {
                        throw "Expected argument " + expectedMethod.arguments[0] + " for call to " + methodName;
                    }
                }
            }
            expectedCallStack.pop();
        };
    },
    objectCallObserver = function (target) {
        var callStack = new CallStack;
        _.each(target, function (method, name) {
            if (typeof(method) == "function") {
                target[name] = function () {
                    callStack.called(name, arguments);
                    method.apply(target, arguments);
                };
            }
        });
        return callStack;
    },
    typeCallObserver = function (Type) {
        var ObservableView = Type.extend({}),
            callStack = new CallStack();

        _.each(Type.prototype, function (method, name) {
            if (typeof(method) == "function") {
                var oldMethod = Type.prototype[name];
                ObservableView.prototype[name] = function () {
                    callStack.called(name, arguments);
                    oldMethod.apply(this, arguments);
                };
            }
        });
        return { ObservableView: ObservableView, callStack: callStack };
    };