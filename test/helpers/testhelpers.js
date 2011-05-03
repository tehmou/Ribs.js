var testlog = function (msg) {
        if (typeof(window.console) != "undefined") {
            console.log(msg);
        }
    },
    CallStack = function () {
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

        this.expectCall = function (methodDef) {
            expectedCallStack.splice(0, 0, methodDef);
            return this;
        };

        this.expectCalls = function (methodDefs) {
            for (var i = 0; i < methodDefs.length; i++) {
                this.expectCall(methodDefs[i]);
            }
            return this;
        };

        this.expectFinished = function () {
            if (expectedCallStack.length > 0) {
                throw "No call to " + expectedCallStack[expectedCallStack.length - 1];
            }
            return this;
        };

        this.called = function (methodName, arguments) {
            if (!running) { return; }

            if (expectedCallStack.length == 0) {
                throw "Did not expect a function call, but got " + methodName;
            } else {
                var expectedMethodDef = expectedCallStack[expectedCallStack.length - 1];

                if (typeof(expectedMethodDef) == "string") {
                    if (methodName !== expectedMethodDef) {
                        throw "Expected call to " + expectedMethodDef + ", but got " + methodName;
                    }
                } else {
                    if (methodName !== expectedMethodDef.name) {
                        throw "Expected call to " + expectedMethodDef.name + ", but got " + methodName;
                    }

                    if (expectedMethodDef.arguments) {
                        // Validate arguments.
                        if (arguments.length != expectedMethodDef.arguments.length) {
                            throw "Wrong number of arguments when calling " + methodName +
                                    " (" + arguments.length + "/" + expectedMethodDef.arguments + ")";
                        }
                        for (var i = 0; i < arguments.length; i++) {
                            if (arguments[i] !== expectedMethodDef.arguments[i]) {
                                throw "Argument #" + i + " did not match the expected one (" +
                                        arguments[i] + " !== " + expectedMethodDef.arguments[i] + ")";
                            }
                        }
                    }

                    if (expectedMethodDef.optionsArgument) {
                        // Validate the first argument as options.
                        var key,
                            options = arguments ? arguments[0] : null,
                            expectedOptions = expectedMethodDef.optionsArgument;
                        if (!options) {
                            throw "Expected options as the first argument but none were given";
                        }
                        for (key in expectedOptions) {
                            if (expectedOptions.hasOwnProperty(key)) {
                                testlog(key);
                                if (options[key] !== expectedOptions[key]) {
                                    throw "Property " + key + " did not match (" + options[key] + "!==" + expectedOptions[key] + ")";
                                }
                            }
                        }
                        for (key in options) {
                            if (options.hasOwnProperty(key)) {
                                if (options[key] !== expectedOptions[key]) {
                                    throw "Property " + key + " did not match (" + options[key] + "!==" + expectedOptions[key] + ")";
                                }
                            }
                        }
                    }
                }
            }
            expectedCallStack.pop();
        };
    },
    objectCallObserver = function (target) {
        var callStack = new CallStack;
        for (var name in target) {
            if (target.hasOwnProperty(name) &&
                    typeof(target[name]) == "function") {
                (function () {
                    var methodName = name, oldMethod = target[methodName];
                    target[methodName] = function () {
                        callStack.called(methodName, arguments);
                        oldMethod.apply(target, arguments);
                    };
                })();
            }
        }
        return callStack;
    },
    typeCallObserver = function (Type) {
        var ObservableType = Type.extend({}),
                callStack = new CallStack();

        for (var name in Type.prototype) {
            if (Type.prototype.hasOwnProperty(name) &&
                    typeof(Type.prototype[name]) == "function") {
                (function () {
                    var methodName = name, oldMethod = Type.prototype[methodName];
                    ObservableType.prototype[methodName] = function () {
                        callStack.called(methodName, arguments);
                        oldMethod.apply(this, arguments);
                    };
                })();
            }
        }
        return { ObservableType: ObservableType, callStack: callStack };
    };