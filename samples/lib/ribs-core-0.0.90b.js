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

Ribs.support = {};

Ribs.utils = {};

Ribs.enableThrowError = {
    multipleViewsForEl: true,
    modelNotFound: true,
    attributeNotFound: true,
    mixinTypeNotFound: true,
    attributeNameNotDefined: true,
    modelNameNotDefined: true,
    noCompositeMixinFoundForParsing: true,
    invalidObjectPath: true
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
            var view = Ribs.utils.addingExtend({}, Ribs.backbone.backbonePivot, options);

            return this.each(function () {
                if (this.ribsView) {
                    Ribs.throwError("multipleViewsForEl");
                }
                this.ribsView = _.extend({}, view, { el: this });
                this.ribsView.mixinInitialize();
                this.ribsView.render();
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

Ribs.utils.createMixinDefinitionParser = function (parserOptions) {
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
                try {
                    var mixin = Ribs.utils.findObject(mixinLibrary, key);
                } catch (e) {
                    Ribs.throwError("mixinTypeNotFound", key);
                }
                mixinClasses.push(_.extend({}, mixin, value));
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

Ribs.mixinParser = Ribs.utils.createMixinDefinitionParser({ mixinLibrary: Ribs.mixins });

Ribs.log = function (msg) {
    if (typeof(console) !== "undefined") {
        console.log(msg);
    }
};

Ribs.utils.addingExtend = function (obj) {
    _.each(Array.prototype.slice.call(arguments, 1), function(source) {
        for (var prop in source) {
            if (_.isFunction(obj[prop])) {
                if (_.isFunction(source[prop])) {
                    (function () {
                        var oldProp = obj[prop],
                            newProp = source[prop];
                        obj[prop] = function () {
                            oldProp.apply(this, arguments);
                            newProp.apply(this, arguments);
                        };
                    }());
                } else {
                    throw "Tried to override a function with non-function";
                }
            } else {
                obj[prop] = source[prop];
            }
        }
    });
    return obj;
};

Ribs.utils.findObject = function (obj, path) {
    var splitPath = path.split(".");
    _.each(splitPath, function (elem) {
        if (obj.hasOwnProperty(elem)) {
            obj = obj[elem];
        } else {
            Ribs.throwError("invalidObjectPath", path);
        }
    });
    return obj;
};




// Support blocks

Ribs.support.functions = { };
Ribs.support.mixins = {};

Ribs.support.functions.resolveValue = function () {
    if (this.pivot && _.isFunction(this.pivot.getValue)) {
        this.value = this.pivot.getValue(this);
    }
};

Ribs.support.functions.resolveJSON = function () {
    if (this.pivot && _.isFunction(this.pivot.getModelJSON)) {
        this.json = this.pivot.getModelJSON(this);
    }
};

Ribs.support.mixins.childMixinElementResolver = {
    mixinInitialize: function () {
        this.redraw();
    },
    redraw: function () {
        if (this.mixins && this.el) {
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

Ribs.support.mixins.compositeBase = {
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
    Ribs.support.mixins.eventful = {
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

Ribs.support.mixins.myModel = {
    myModelName: null,
    modelAdded: function (name, model) {
        if (name !== undefined && name === this.myModelName) {
            this.myModel = model;
            if (_.isFunction(this.myModelAdded)) {
                this.myModelAdded(model);
            }
        }
    },
    modelRemoved: function (name, model) {
        if (name !== undefined && name === this.myModelName) {
            this.myModel = null;
            if (_.isFunction(this.myModelRemoved)) {
                this.myModelRemoved(model);                
            }
        }
    }
};

Ribs.support.mixins.pivotEl = {
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
Ribs.support.mixins.renderChain = {
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

Ribs.support.mixins.selfParsing = {
    mixinDefinitions: null,
    mixinInitialize: function () {
        this.mixinDefinitions = this.mixinDefinitions || [];
        Ribs.mixinParser.createCompositeFromDefinitions({
            mixinDefinitions: this.mixinDefinitions,
            composite: this
        });
    }
};

Ribs.support.mixins.templated = {
    templateSelector: null,
    templateFunction: null,
    models: null,

    mixinInitialize: function () {
        if (!this.templateFunction && this.templateSelector) {
            this.templateFunction = _.template($(this.templateSelector).html());
        }
        if (!this.el && this.templateFunction) {
            this.el = $(this.templateFunction({}));
            this.templateFunction = _.template(this.el.html());
        }
    },
    redraw: function () {
        if (this.templateFunction) {
            $(this.el).html(this.templateFunction(this.json || {}));
        }
    }
};




// Core mixins

Ribs.mixins.plain = Ribs.support.mixins.eventful;
Ribs.mixins.plainWithModel = Ribs.utils.addingExtend({},
        Ribs.mixins.plain,
        Ribs.support.mixins.modelful
    );
Ribs.mixins.composite = Ribs.utils.addingExtend({},
        Ribs.support.mixins.compositeBase,
        Ribs.support.mixins.childMixinElementResolver
    );
Ribs.mixins.templated = Ribs.utils.addingExtend({},
        { redraw: Ribs.support.functions.resolveJSON },
        { redraw: Ribs.support.functions.resolveValue },
        Ribs.support.mixins.templated
    );

Ribs.mixins.plainPivot = Ribs.utils.addingExtend({},
        Ribs.mixins.templated,
        Ribs.support.mixins.renderChain,
        Ribs.support.mixins.selfParsing,
        Ribs.mixins.composite,
        Ribs.support.mixins.pivotEl
    );

