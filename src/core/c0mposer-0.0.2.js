/**
 * c0mposer.js 0.0.2
 *
 * (c) 2011 Timo Tuominen
 * May be freely distributed under the MIT license.
 * For all details and documentation:
 * http://tehmou.github.com/c0mposer.js
 *
 */

var c0mposer;

(function () {
    c0mposer = {

        debug: false,
        library: {},

        instance: function (options) {
            return _.extend({}, c0mposer, options || {});
        },
        create: function () {
            Array.prototype.splice.apply(arguments, [0, 0, {}]);
            return this.compose.apply(this, arguments);
        },
        compose: function () {
            var obj = arguments[0];
            if (this.debug) {
                obj._lineage = obj._lineage || [undefined];
            }
            Array.prototype.splice.apply(arguments, [0, 1]);
            _.each(arguments, _.bind(function (argument) {
                this.composeOne(obj, argument);
            }, this));
            return obj;
        },
        composeOne: function (obj, srcDef) {
            var src = srcDef;
            if (_.isString(src)) {
                if (this.debug) {
                    obj._lineage.push(src);
                }
                if (_.isFunction(this.parseString)) {
                    src = this.parseString(src);
                }
            } else if (this.debug && src._lineage) {
                obj._lineage = obj._lineage.concat(src._lineage);
            }
            _.each(src, _.bind(function (value, key) {
                this.composeProperty(obj, src, key, srcDef);
            }, this));
        },
        parseString: function (string) {
            return this.findNested(this.library, string);
        },
        findNested: function (obj, path) {
            var splitPath = path.split(".");
            _.each(splitPath, _.bind(function (elem) {
                if (obj.hasOwnProperty(elem)) {
                    obj = obj[elem];
                } else {
                    this.throwError("invalidObjectPath", path);
                }
            }, this));
            return obj;
        },
        resolveKind: function (obj) {
            if (_.isArray(obj)) {
                return "array";
            } else if (_.isFunction(obj)) {
                return "function";
            } else if ( _.isString(obj) || _.isBoolean(obj) || _.isNumber(obj)) {
                return "basic";
            } else if (_.isUndefined(obj) || _.isNaN(obj) || _.isNull(obj)) {
                return "empty";
            } else {
                return "object";
            }
        },
        composeProperty: function (obj, src, prop, debugName) {
            var objKind = this.resolveKind(obj[prop]);
            var srcKind = this.resolveKind(src[prop]);
            var value;

            if (srcKind === "empty") {
                return;
            } else if (objKind === "empty") {
                value = src[prop];
            } else if (objKind === "basic" && srcKind === "basic") {
                value = src[prop];
            } else if (objKind === "array" && srcKind === "array") {
                value = this.composeArrays(obj[prop], src[prop]);
            } else if (objKind === "function" && srcKind === "function") {
                value = this.composeFunctions(obj[prop], src[prop], debugName);
            } else if (objKind === "object" && srcKind === "object") {
                value = this.composeObjects(obj[prop], src[prop]);
            } else {
                this.throwError("extendingPropertyKindMismatch", [objKind, srcKind]);
                return;
            }
            obj[prop] = value;
        },
        composeArrays: function (a, b) {
            return a.concat(b);
        },
        composeObjects: function (a, b) {
            return _.extend({}, a, b);
        },
        composeFunctions: function (a, b, debugName) {
            var stackFunction;
            if (!a.hasOwnProperty("_stack")) {
                stackFunction = this.createStackFunction();
                stackFunction.pushFunction(a);
            } else {
                stackFunction = a;
            }
            stackFunction.pushFunction(b, debugName);
            return stackFunction;
        },
        createStackFunction: function () {
            var stack = [];
            var stackFunction;
            var debug = this.debug;

            stackFunction = function () {
                for (var i = 0; i < stack.length; i++) {
                    stack[i].apply(this, arguments);
                }
            };
            stackFunction._stack = stack;
            if (debug) {
                stackFunction._lineage = [];
            }
            stackFunction.pushFunction = function (fnc, debugName) {
                if (fnc.hasOwnProperty("_stack")) {
                    this.concat(fnc);
                } else {
                    this.addOne(fnc, debugName);
                }
                return this;
            };
            stackFunction.concat = function (stackFunction) {
                Array.prototype.splice.apply(this._stack, [this._stack.length, 0].concat(stackFunction._stack));
                if (debug) {
                    Array.prototype.splice.apply(this._lineage, [this._lineage.length, 0].concat(stackFunction._lineage));
                }
                return this;
            };
            stackFunction.addOne = function (fnc, debugName) {
                this._stack.push(fnc);
                if (debug) {
                    this._lineage.push(debugName);
                }
                return this;
            };
            return stackFunction;
        },

        log: function (msg) {
            if (this.debug && typeof (console) != "undefined") {
                console.log(msg);
            }
        },
        throwError: function (msg, obj) {
            this.log("c0mposer error \"" + msg + "\", with object:");
            this.log(obj);
            throw [msg, obj];
        }
    };
})();