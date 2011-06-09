/*global $,_,console*/

 /**
  * @namespace Ribs.js 0.0.90b
  * 
  * (c) 2011 Timo Tuominen
  * Ribs.js may be freely distributed under the MIT license.
  * For all details and documentation:
  * http://tehmou.github.com/ribs.js
 **/ 

// Core classes

var Ribs = {};

/**
 * @field
 * @desc Hash of all mixins visible to the mixin
 * parser. Add your custom ones here.
**/
Ribs.mixins = {};

/**
 * @field
 * @desc Hash of support mixins to use in creation
 * of other mixins.
 */
Ribs.mixinBase = {};

Ribs.enableThrowError = {
    multipleViewsForEl: true,
    modelNotFound: true,
    attributeNotFound: true,
    mixinTypeNotFound: true,
    attributeNameNotDefined: true,
    modelNameNotDefined: true,
    noCompositeMixinFoundForParsing: true
};

Ribs.throwError = function (errorType, msg) {
    if (!Ribs.enableThrowError.hasOwnProperty(errorType) || Ribs.enableThrowError[errorType]) {
        throw errorType + (typeof(msg) !== "undefined" ? ": " + msg : "");
    }
};


Ribs.VERSION = "0.0.90b";


// jQuery plugin support

(function ($) {

    var methods = {
        createBackbone: function (options) {
            options = options || {};

            var view = _.extend({}, Ribs.mixins.backbonePivot, options.options);

            return this.each(function () {
                if (this.ribsView) {
                    Ribs.throwError("multipleViewsForEl");
                }

                this.ribsView = _.extend({ el: this }, view);
            });
        }
    };

    $.fn.ribs = function (method) {
        if (methods.hasOwnProperty(method)) {
            return methods[method].apply(this, Array.prototype.splice.call(arguments, 1));
        } else {
            $.error("Method " + method + " does not exist on jQuery.ribs");
        }
    };

}($));




// Utilities

Ribs.createMixinDefinitionParser = function (parserOptions) {
    parserOptions = parserOptions || {};

    var parser = { },
        mixinLibrary = parserOptions.mixinLibrary || {};

    parser.createCompositeFromDefinitions = function (options) {
        options = options || {};

        if (!mixinLibrary.hasOwnProperty("composite")) {
            Ribs.throwError("noCompositeMixinFoundForParsing");
        }

        var composite = options.composite || _.clone(mixinLibrary.composite),
            mixinDefinitions = options.mixinDefinitions || [],
            mixinClasses = options.mixinClasses || [];

        composite.elementSelector = options.elementSelector;

        if (_.isArray(mixinDefinitions)) {
            var parseOne = function (value, key) {
                if (!mixinLibrary[key]) {
                    Ribs.throwError("mixinTypeNotFound", key);
                }
                mixinClasses.push(_.extend({}, mixinLibrary[key], value));
            };
            for (var i = 0; i < mixinDefinitions.length; i++) {
                _.each(mixinDefinitions[i], parseOne);
            }
        } else {
            var _createMixinFromDefinitions = function (nestedMixinDefinitions, elementSelector) {
                var mixin = parser.createCompositeFromDefinitions({
                    mixinDefinitions: nestedMixinDefinitions,
                    elementSelector: elementSelector
                });
                mixinClasses.push(mixin);
            };
            _.each(mixinDefinitions, _createMixinFromDefinitions);
        }
        composite.mixinClasses = mixinClasses;
        return composite;
    };

    return parser;
};

Ribs.mixinParser = Ribs.createMixinDefinitionParser({ mixinLibrary: Ribs.mixins });

Ribs.log = function (msg) {
    if (typeof(console) !== "undefined") {
        console.log(msg);
    }
};


// Support mixins

Ribs.mixinBase.childMixinElementResolver = {
    mixinInitialize: function () {
        this.redraw();
    },
    redraw: function () {
        if (this.mixins) {
            var el = $(this.el).find(this.elementSelector);
            if (el.length === 0) {
                el = this.el;
            }
            _.each(this.mixins, function (mixin) {
                mixin.el = mixin.elementSelector ? el.find(mixin.elementSelector) : el;
                if (typeof(mixin.redraw) === "function") {
                    mixin.redraw.apply(mixin, []);
                }
            });
        }
    }
};

Ribs.mixinBase.compositeBase = {
    inheritingMethods: null,
    mixinClasses: null,
    mixinInitialize: function () {
        this.inheritingMethods = this.inheritingMethods || [];
        this.mixinClasses = this.mixinClasses || [];
        this.mixins = [];
        _.each(this.mixinClasses, _.bind(function (mixinType) {
            var mixin = _.extend({}, mixinType, {
                inheritingMethods: this.inheritingMethods,
                pivot: this.pivot
            });
            _.bind(function () { _.bindAll(this); }, mixin)();
            this.mixins.push(mixin);
        }, this));
        this.callAllMixins("mixinInitialize", arguments);
        this.initializeInheritingMethods(this);
    },
    callAllMixins: function (methodName, originalArguments) {
        _.each(this.mixins, function (mixin) {
            if (typeof(mixin[methodName]) === "function") {
                mixin[methodName].apply(mixin, originalArguments);
            }
        });
    },
    initializeInheritingMethods: function () {
        _.each(this.inheritingMethods, _.bind(function (methodName) {
            var oldMethod = this[methodName];
            this[methodName] = function () {
                if (typeof(oldMethod) === "function") {
                    oldMethod.apply(this, arguments);
                }
                this.callAllMixins(methodName, arguments);
            };
        }, this));
    },
    findMixinWithElementSelector: function (elementSelector) {
        for (var i = 0; i < this.mixinClasses.length; i++) {
            if (this.mixinClasses[i].elementSelector === elementSelector) {
                return this.mixinClasses[i];
            }
        }
        return null;
    }
};

(function () {
    var eventSplitter = /^(\w+)\s*(.*)$/;
    Ribs.mixinBase.eventful = {
        unbindEvents: function () {
            if (this.el) {
                this.el.unbind();
            }
        },
        bindEvents: function () {
            if (!this.events || !this.el) {
                return;
            }
            _.each(this.events, _.bind(function (methodName, key) {
                var match = key.match(eventSplitter),
                        eventName = match[1], selector = match[2],
                        method = _.bind(this[methodName], this);
                if (selector === '') {
                    this.el.bind(eventName, method);
                } else {
                    this.el.delegate(selector, eventName, method);
                }
            }, this));
        }
    };
}());

Ribs.mixinBase.modelful = {
    getMyModelJSON: function () {
        if (this.modelName) {
            return this.getModelJSON({
                modelName: this.modelName
            });
        } else {
            Ribs.throwError("modelNameNotDefined");
        }
    },
    getMyValue: function () {
        if (this.modelName) {
            if (this.attributeName) {
                return this.getValue({
                    modelName: this.modelName,
                    attributeName: this.attributeName
                });
            } else {
                Ribs.throwError("attributeNameNotDefined", "modelName=" + this.modelName);
            }
        } else {
            Ribs.throwError("modelNameNotDefined");
        }
        return null;
    },
    setMyValue: function (value) {
        if (this.modelName) {
            if (this.attributeName) {
                this.setValue({
                    modelName: this.modelName,
                    attributeName: this.attributeName,
                    value: value
                });
                return true;
            } else {
                Ribs.throwError("attributeNameNotDefined", "modelName=" + this.modelName);
            }
        } else {
            Ribs.throwError("modelNameNotDefined");
        }
        return false;
    }
};

Ribs.mixinBase.pivotEl = {
    tagName: "div",
    el: null,
    initialized: false,

    /**
     * @method
     * @desc Create "el" if it does not already exist.
     */
    mixinInitialize: function () {
        this.el = this.el || document.createElement(this.tagName || "div");
        this.pivot = this;
    },

    /**
     * @method
     * @desc Default pivot behavior calls $(this.el).detach();
     */
    hide: function () {
        $(this.el).detach();
    },

    /**
     * @method
     * @desc Default pivot behavior calls $(this.el).remove();
     */
    dispose: function () {
        $(this.el).remove();
    }

};

/**
 * @class Creates a more sophisticated component life cycle
 * inside the render function.<br /><br />
 *
 * Ribs.js uses this mixin internally to create views.
**/
Ribs.mixinBase.renderChain = {
    /**
     * @field
     * @desc When calling render(), if this flag is set,
    * a redraw will occur. When redraw is finished, this
     * flag is again reset to false.
     */
    invalidated: true,

    mixinInitialize: function () {
        this.inheritingMethods = (this.inheritingMethods || []).concat([
            "unbindEvents", "bindEvents", "redraw", "refresh", "hide", "dispose"
        ]);
    },
    
    /**
     * @method
     * @desc Override to Backbone.View.render.<br /><br />
     *
     * Exits if initialized flag is not set.<br /><br />
     *
     * Maintains the View life cycle of rendering. If invalidated
     * flag is set, unbinds all DOM events, calls redraw, and then
     * binds the events. After this comes always refresh,
     * regardless of the invalidated flag.
     */
    render: function () {
        if (!this.pivot || !this.pivot.initialized) { return; }
        if (this.invalidated) {
            this.unbindEvents();
            this.redraw();
            this.bindEvents();
            this.invalidated = false;
        }
        this.refresh();
    },

    /**
     * @method
     * @desc Clear all listeners to DOM events. The default
     * implementation only calls $(this.el).unbind().
     */
    unbindEvents: function () {
        if (this.el) {
            $(this.el).unbind();
        }
    },

    /**
     * @method
     * @desc Set all listeners to DOM events. This is an empty
     * function by default.
     */
    bindEvents: function () { },

    /**
     * @method
     * @desc Do all expensive DOM operations that could break
     * listeners (hiding etc.). This is an empty
     * function by default.
     */
    redraw: function () { },

    /**
     * @method
     * @desc Set styles, calculates values, etc. This is called
     * each time the View is rendered, so don't do anything expensive
     * here. This is an empty function by default.
     */
    refresh: function () { },

    /**
     * @method
     * @desc Remove from DOM with the prospect of reattaching.
     */
    hide: function () { },

    /**
     * @method
     * @desc Destroy the View beyond restoring.
     */
    dispose: function () { }
};

Ribs.mixinBase.selfParsing = {
    mixinDefinitions: null,
    mixinInitialize: function () {
        this.mixinDefinitions = this.mixinDefinitions || [];
        Ribs.mixinParser.createCompositeFromDefinitions({
            mixinDefinitions: this.mixinDefinitions,
            composite: this
        });
    }
};




// Basic mixin classes

Ribs.mixins.plain = Ribs.mixinBase.eventful;
Ribs.mixins.plainWithModel = _.extend({},
        Ribs.mixins.plain,
        Ribs.mixinBase.modelful,
        {
            mixinInitialize: function () {
                Ribs.mixins.plain.mixinInitialize.apply(this, arguments);
                Ribs.mixinBase.modelful.mixinInitialize.apply(this, arguments);
            }
        });
Ribs.mixins.composite = _.extend({},
        Ribs.mixinBase.compositeBase,
        Ribs.mixinBase.childMixinElementResolver,
        {
            mixinInitialize: function () {
                Ribs.mixinBase.compositeBase.mixinInitialize.apply(this, arguments);
                Ribs.mixinBase.childMixinElementResolver.mixinInitialize(this, arguments);
            }
        });

