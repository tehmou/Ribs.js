// Core classes

/*global $,_,Backbone,console*/

/**
 * Ribs.js 0.0.84
 *     (c) 2011 Timo Tuominen
 *     Ribs.js may be freely distributed under the MIT license.
 *     For all details and documentation:
 *     http://tehmou.github.com/ribs.js
**/

var Ribs = {};

Ribs.VERSION = "0.0.84";

Ribs.mixins = {};

Ribs.mixinMethods = [
    "customInitialize",
    "bindToModel",
    "render", "redraw", "refresh",
    "unbindEvents", "bindEvents",
    "hide", "dispose"
];

Ribs.inheritingMixinProperties = [
    "attributeName", "modelName"
];


/**
* Creates a Backbone.View that inherits Ribs.ManagedView
* and contains the mixins defined in myOptions.
**/
Ribs.createMixed = function (myOptions) {
    myOptions = myOptions || {};

    var Buildee = myOptions.base ? myOptions.base.extend() : Ribs.ManagedView.extend(),
        NewRootMixin = Ribs.mixinParser.createCompositeFromDefinitions(myOptions.mixins),
        OldRootMixin = myOptions.base && myOptions.base.RootMixin,

        delegateOneToRootMixin = function (methodName) {
            Buildee.prototype[methodName] = function () {
                Ribs.ManagedView.prototype[methodName].apply(this, arguments);
                if (this.rootMixin && this.rootMixin[methodName]) {
                    this.rootMixin[methodName].apply(this.rootMixin, arguments);
                }
            };
        };

    _.each(Ribs.mixinMethods, delegateOneToRootMixin);

    if (OldRootMixin) {
        Buildee.RootMixin = Ribs.mixins.mixinComposite({
            mixinClasses: [OldRootMixin, NewRootMixin]
        });
    } else {
        Buildee.RootMixin = NewRootMixin;
    }

    Buildee.prototype.initialize = function () {
        if (typeof(Buildee.RootMixin) === "function") {
            this.rootMixin = new Buildee.RootMixin(this, this.options.model);
        } else {
            this.rootMixin = _.extend({}, Buildee.RootMixin);
        }
        Ribs.ManagedView.prototype.initialize.apply(this, arguments);
    };

    return Buildee;
};

// A more sophisticated Backbone.View that adds
// support for component lifecycles, as often needed
// in RIA applications.
//
// Ribs.js uses the model ribsUIModels to store
// an arbitrary number of models that the View renders.
// The default ones are:
//
// data:        The default Backbone property model.
// dataUI:      A model added to the data model with
//              Ribs.augmentModelWithUIProperties.
// internal:    UI model that only this View uses internally.
//

Ribs.ManagedView = Backbone.View.extend({
    invalidated: true,

    initialize: function () {
        _.bindAll(this, "customInitialize", "bindToModel", "render", "unbindEvents", "redraw", "refresh", "bindEvents", "hide", "dispose");
        this.ribsUIModels = new Backbone.Model({ internal: new Backbone.Model() });
        this.ribsUIModels.set(this.options.ribsUIModels);
        Backbone.View.prototype.initialize.apply(this, arguments);
        if (this.model) {
            this.bindToModel(this.model);
        }
        this.customInitialize();
        this.initialized = true;
        this.render();
    },
    customInitialize: function () { },
    bindToModel: function (model) {
        if (this.model && this.model.ribsUI) {
            this.model.ribsUI.unbind("change", this.render);
        }
        this.model = model;
        if (this.model) {
            Ribs.augmentModelWithUIAttributes(this.model);
            this.model.ribsUI.bind("change", this.render);
        }
        this.ribsUIModels.set({
            data: model,
            dataUI: model.ribsUI
        });
        this.invalidated = true;
    },
    render: function () {
        if (!this.initialized) { return; }
        this.unbindEvents();
        if (this.invalidated) {
            this.redraw(this.el);
            this.invalidated = false;
        }
        this.refresh();
        this.bindEvents();
    },
    unbindEvents: function () {
        $(this.el).unbind();
    },
    bindEvents: function () { },
    redraw: function (el) { },
    refresh: function () { },
    hide: function () {
        $(this.el).detach();
    },
    dispose: function () {
        $(this.el).remove();
    }
});

(function () {

    var callAllMixins = function (mixins, methodName, originalArguments) {
            _.each(mixins, function (mixin) {
                if (mixin[methodName]) {
                    mixin[methodName].apply(mixin, originalArguments);
                }
            });
        },
        updateMixinEl = function (mixin, el) {
            mixin.el = mixin.elementSelector ? el.find(mixin.elementSelector) : el;
        },
        updateMixinModel = function (mixin) {
            if (mixin.parent && mixin.parent.ribsUIModels) {
                var model = mixin.parent.ribsUIModels.get(mixin.modelName);
                if (mixin.model !== model) {
                    if (typeof(mixin.bindToModel) === "function") {
                        mixin.bindToModel(model);
                    }
                    mixin.model = model;
                }
            }
        },
        eventSplitter = /^(\w+)\s*(.*)$/;

    Ribs.mixins.mixinComposite = function (classOptions) {
        classOptions = classOptions || {};

        var MixinCompositeInst = function (parentView, model) {

                this.customInitialize = function () {
                    if (parentView) {
                        parentView.bind("change", this.updateMixinModels);
                    }
                    this.mixins = [];
                    _.each(this.mixinClasses, _.bind(function (MixinClass) {
                        var mixin = new MixinClass(parentView, model), that = this;
                        _.bind(function () { _.bindAll(this); }, mixin)();

                        mixin.parent = parentView;
                        _.each(Ribs.inheritingMixinProperties, function (property) {
                            mixin[property] = mixin[property] || that[property];
                        });
                        updateMixinModel(mixin);

                        this.mixins.push(mixin);
                    }, this));
                    callAllMixins(this.mixins, "customInitialize", arguments);
                };

                this.bindToModel = function () {
                    this.updateMixinModels();
                };

                this.updateMixinModels = function () {
                    _.each(this.mixins, function (mixin) {
                        updateMixinModel(mixin);
                    });
                };

                this.unbindEvents = function () {
                    if (this.el) {
                        this.el.unbind();
                    }
                    _.each(this.mixins, function (mixin) {
                        if (mixin.el) {
                            mixin.el.unbind();
                        }
                        if (mixin.unbindEvents) {
                            mixin.unbindEvents.apply(mixin);
                        }
                    });
                };

                this.bindEvents = function () {
                    _.each(this.mixins, function (mixin) {
                        if (mixin.bindEvents) {
                            mixin.bindEvents.apply(mixin);
                        }
                        if (!mixin || !mixin.events || !mixin.el) {
                            return;
                        }
                        _.each(mixin.events, _.bind(function (methodName, key) {
                            var match = key.match(eventSplitter),
                                    eventName = match[1], selector = match[2],
                                    method = _.bind(this[methodName], this);
                            if (selector === '') {
                                mixin.el.bind(eventName, method);
                            } else {
                                mixin.el.delegate(selector, eventName, method);
                            }
                        }, mixin));
                    });
                };

                this.redraw = function (parentEl) {
                    this.el = $(parentEl).find(this.elementSelector);
                    if (this.el.length === 0) {
                        if (this.elementCreator) {
                            this.el = $(parentEl).append($(this.elementCreator));
                        } else {
                            this.el = $(parentEl);
                        }
                    }
                    _.each(this.mixins, _.bind(function (mixin) {
                        updateMixinEl(mixin, this.el);
                        if (mixin.redraw) {
                            mixin.redraw.apply(mixin, [mixin.el]);
                        }
                    }, this));
                };

                _.extend(this, classOptions);
            };

        MixinCompositeInst.prototype.mixinClasses = classOptions.mixinClasses;

        _.each(Ribs.mixinMethods, function (methodName) {
            if (!MixinCompositeInst.prototype.hasOwnProperty(methodName)) {
                MixinCompositeInst.prototype[methodName] = function () {
                    callAllMixins(this.mixins, methodName, arguments);
                };
            }
        });

        return MixinCompositeInst;
    };
}());

// jQuery plugin support

(function ($) {

    var methods = {
        createView: function (options) {
            options = options || {};
            var View;
            if (options.view) {
                View = typeof(options.view) === "function" ? options.view : Ribs.createMixed(options.view);
            } else if (options.mixins) {
                View = Ribs.createMixed({ mixins: options.mixins });                
            }

            if (!View) {
                if (!View) {
                    $.error("options.view was not defined when calling jQuery.ribs createMixed");
                }
            }
            
            return this.each(function () {
                if (this.ribsView) {
                    if (typeof(this.ribsView.dispose) === "function") {
                        this.ribsView.dispose();
                    }
                }
                this.ribsView = new View($.extend(options.options || {}, { el: this }));
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

Ribs.mixinHelpers = {
    getMyValue: function () {
        return this.model && this.model.get(this.attributeName);
    },
    setMyValue: function (value) {
        if (this.model && this.attributeName) {
            var newValues = {};
            newValues[this.attributeName] = value;
            this.model.set(newValues);
            return true;
        }
        return false;
    }
};Ribs.createMixinDefinitionParser = function (parseOne) {
    var parser = { };

    parser.parseOne = parseOne;

    parser.createCompositeFromDefinitions = function (mixinDefinitions, options) {
        options = options || {};
        mixinDefinitions = mixinDefinitions || [];
        var mixinClasses = [], i, l,
            _parseOne = function (o, name) {
                var MixinClass = parser.parseOne.apply(this, [o, name]);
                mixinClasses.push(MixinClass);
            },
            _createMixinFromDefinitions = function (nestedMixinDefinitions, elementSelector) {
                var MixinClass = parser.createCompositeFromDefinitions(
                        nestedMixinDefinitions, { elementSelector: elementSelector });
                mixinClasses.push(MixinClass);
            };

        if (_.isArray(mixinDefinitions)) {
            for (i = 0, l = mixinDefinitions.length; i < l; i++) {
                var mixinDefinitionObject = mixinDefinitions[i];

                if (typeof(mixinDefinitionObject) === "function") {
                    mixinClasses.push(mixinDefinitionObject);
                } else {
                    _.each(mixinDefinitionObject, _parseOne);
                }
            }
        } else {
            _.each(mixinDefinitions, _createMixinFromDefinitions);
        }

        return Ribs.mixins.mixinComposite(_.extend(options, { mixinClasses: mixinClasses }));
    };

    return parser;
};

Ribs.createMixinResolver = function (mixinLibrary) {
    return function (options, name) {
        if (name === "inline") {
            return function () { return options; };
        }
        var mixinFunction = mixinLibrary[name];
        if (!mixinFunction) {
            throw "Could not find mixin " + name;
        }
        return mixinFunction(options);
    };
};

Ribs.mixinParser = Ribs.createMixinDefinitionParser(Ribs.createMixinResolver(Ribs.mixins));

Ribs.NonSyncingCollection = Backbone.Collection.extend({
    add: function (item) {
        var oldCollection = item.collection;
        Backbone.Collection.prototype.add.apply(this, arguments);
        item.collection = oldCollection;
    },
    remove: function (item) {
        var oldCollection = item.collection;
        Backbone.Collection.prototype.remove.apply(this, arguments);
        item.collection = oldCollection;
    }
});Ribs.createUIManager = function (key, myOptions) {
    myOptions = myOptions || {};

    Ribs.uiManagers = Ribs.uiManagers || {};

    Ribs.uiManagers[key] = (function () {
        var allowMultiselect = myOptions.allowMultiselect,
            viewModel = new Backbone.Model({ nowHovering: null, nowSelected: null }),
            hoveringChanged = function (event) {
                var item = event[0];
                if (item === viewModel.get("nowHovering") && !item.get("hovering")) {
                    viewModel.set({ nowHovering: null });
                } else if (item !== viewModel.get("nowHovering") && item.get("hovering")) {
                    var lastHovering = viewModel.get("nowHovering");
                    viewModel.set({ nowHovering: item });
                    if (lastHovering) {
                        lastHovering.set({ hovering: false });
                    }
                }
            },
            selectedChanged = function (event) {
                var item = event[0];
                if (item === viewModel.get("nowSelected") && !item.get("selected")) {
                    viewModel.set({ nowSelected: null });
                } else if (item !== viewModel.get("nowSelected") && item.get("selected")) {
                    var lastSelected = viewModel.get("nowSelected");
                    viewModel.set({ nowSelected: item });
                    if (!allowMultiselect && lastSelected) {
                         lastSelected.set({ selected: false });
                    }
                }
            },
            unregister = function (model) {
                if (model) {
                    model.unbind("ribsUI:change:hovering", hoveringChanged);
                    model.unbind("ribsUI:change:selected", selectedChanged);
                }
            },
            register = function (model) {
                if (model) {
                    unregister(model);
                    model.bind("ribsUI:change:hovering", hoveringChanged);
                    model.bind("ribsUI:change:selected", selectedChanged);
                }
            };

        return {
            register: register,
            unregister: unregister,
            getViewModel: function () { return viewModel; }
        };
    }());
};

Ribs.augmentModelWithUIAttributes = function (model) {
    if (!model.hasOwnProperty("ribsUI")) {
        model.ribsUI = new Backbone.Model();

        // Do this until the next version of Backbone.js:
        // https://github.com/documentcloud/backbone/issues/309
        model.ribsUI.safeUnbind = function (ev, callback) {
            var calls, i, l, emptyFunction = function () { };
            if (!ev) {
                this._callbacks = {};
            } else {
                calls = this._callbacks;
                if (calls) {
                    if (!callback) {
                        calls[ev] = [];
                    } else {
                        var list = calls[ev];
                        if (!list) { return this; }
                        for (i = 0, l = list.length; i < l; i++) {
                            if (callback === list[i]) {
                                list[i] = emptyFunction;
                                break;
                            }
                        }
                    }
                }
            }
            return this;
        };

        model.ribsUI.set({ owner: model });
        model.ribsUI.bind("all", function (event) {
            var ev = "ribsUI:" + event;
            model.trigger(ev, Array.prototype.slice.call(arguments, 1));
        });
    }
};

Ribs.log = function (msg) {
    if (typeof(console) !== "undefined") {
        console.log(msg);
    }
};


// Default mixin classes

Ribs.mixins.invalidateOnBackboneModelChange = function (classOptions) {
    var InvalidateOnChangeInst = function (parent) {
            var model;
            return _.extend({
                modelName: "dataUI",
                eventName: "change",
                excludedAttributes: null,
                includedAttributes: null,

                bindToModel: function (value) {
                    if (model) {
                        if (typeof(model.safeUnbind) === "function") {
                            model.safeUnbind(this.eventName, this.change);
                        } else {
                            model.unbind(this.eventName, this.change);
                        }
                    }
                    model = value;
                    if (model) {
                        model.bind(this.eventName, this.change);
                    }
                },
                change: function (ev) {
                    _.each(ev.changedAttributes(), this.checkAttribute);
                },
                checkAttribute: function (value, attrName) {
                    var excluded = this.excludedAttributes && _.indexOf(this.excludedAttributes, attrName) !== -1,
                        included = this.includedAttributes && _.indexOf(this.includedAttributes, attrName) !== -1;
                    if (!excluded && included && !parent.invalidated) {
                        parent.invalidated = true;
                        _.defer(parent.render);
                    }
                }
            }, classOptions || {});
        };

    return InvalidateOnChangeInst;
};

Ribs.mixins.simpleList = function (classOptions) {
    classOptions = classOptions || {};
    var ItemRenderer = classOptions.ItemRenderer,
        SimpleListInst = function (parent) {
            var listModel, listViews, refreshingList;
            return _.extend({
                modelName: "data",
                attributeName: null,
                itemTagName: null,
                itemClassName: null,

                bindToModel: function (model) {
                    _.each(listViews, function (view) {
                        view.dispose();
                    });
                    listViews = {};
                    if (listModel) {
                        listModel.unbind("add", this.addOne);
                        listModel.unbind("remove", this.removeOne);
                        listModel.unbind("refresh", this.addAll);
                    }
                    listModel = this.attributeName ? model.get(this.attributeName) : model;
                    if (listModel) {
                        listModel.bind("add", this.addOne);
                        listModel.bind("remove", this.removeOne);
                        listModel.bind("refresh", this.addAll);
                        this.addAll();
                    }
                },
                redraw: function () {
                    this.el.children().detach();
                    _.each(listViews, _.bind(function (view) {
                        this.el.append(view.el);
                    }, this));
                },
                render: function () {
                    _.each(listViews, function (view) {
                        view.render();
                    });
                },

                addOne: function (item) {
                    if (!listViews.hasOwnProperty(item.cid)) {
                        var listView = new ItemRenderer({
                                model: item,
                                tagName: this.itemTagName,
                                className: this.itemClassName
                            });
                        listViews[item.cid] = listView;
                        if (!refreshingList) {
                            parent.invalidated = true;
                            parent.render();
                        }
                    }
                },
                addAll: function () {
                    refreshingList = true;
                    listViews = {};
                    if (listModel.each) {
                        listModel.each(this.addOne);
                    }
                    parent.invalidated = true;
                    parent.render();
                    refreshingList = false;
                },
                removeOne: function (item) {
                    if(listViews.hasOwnProperty(item.cid)) {
                        $(listViews[item.cid].el).remove();
                        delete listViews[item.cid];
                    }
                }
            }, classOptions || {});
        };

    return SimpleListInst;
};

Ribs.mixins.templated = function (classOptions) {
    classOptions = classOptions || {};
    var defaultTemplateFunction = classOptions.templateSelector && _.template($(classOptions.templateSelector).html()),
        TemplatedInst = function (parent) {
                return _.extend({
                    templateSelector: null,
                    templateFunction: defaultTemplateFunction,
                    modelNames: ["data", "dataUI"],
                    className: null,

                    redraw: function () {
                        var modelJSON = {};
                        for (var i = 0; i < this.modelNames.length; i++) {
                            var modelName = this.modelNames[i];
                            if (parent && parent.ribsUIModels && parent.ribsUIModels.get(modelName)) {
                                modelJSON = _.extend(modelJSON, parent.ribsUIModels.get(modelName).toJSON());
                            }
                        }
                        modelJSON.t = function (name) {
                            return this.hasOwnProperty(name) ? this[name] : "";
                        };
                        this.el.html(this.templateFunction(modelJSON));
                        if (this.className) {
                            this.el.toggleClass(this.className, true);
                        }
                    }
                }, classOptions);
            };

    return TemplatedInst;
};

Ribs.mixins.editable = function (classOptions) {
    var EditableInst = Ribs.mixinParser.createCompositeFromDefinitions([
        { toggleAttribute: {
            onEvent: "click",
            offEvent: "click"
        }},
        { toggleableClass: {
            className: "editing"
        }}
    ], _.extend({
        attributeName: "editing",
        modelName: "dataUI"
    }, classOptions));

    return EditableInst;
};

Ribs.mixins.hoverable = function (classOptions) {
    var HoverableInst = Ribs.mixinParser.createCompositeFromDefinitions([
        { toggleAttribute: {
            onEvent: "mouseenter",
            offEvent: "mouseleave"
        }},
        { toggleableClass: {
            className: "hovering"
        }}
    ], _.extend({
        attributeName: "hovering",
        modelName: "dataUI"
    }, classOptions));

    return HoverableInst;
};

Ribs.mixins.openable = function (classOptions) {
    var OpenableInst = Ribs.mixinParser.createCompositeFromDefinitions([
        { toggleAttribute: {
            onEvent: "click",
            offEvent: "click"
        }},
        { toggleableClass: {
            className: "open"
        }}
    ], _.extend({
        attributeName: "open",
        modelName: "dataUI"
    }));

    return OpenableInst;
};

Ribs.mixins.selectable = function (classOptions) {
    var SelectableInst = Ribs.mixinParser.createCompositeFromDefinitions([
        { toggleAttribute: {
            onEvent: "click",
            offEvent: "click"
        }},
        { toggleableClass: {
            className: "selected"
        }}
    ], _.extend({
        attributeName: "selected",
        modelName: "dataUI"
    }, classOptions));

    return SelectableInst;
};

Ribs.mixins.functionValueEdit = function (classOptions) {
    var FunctionValueEditInst = Ribs.mixins.textValueEdit(_.extend({
        readFunctionName: null,
        writeFunctionName: null,

        readFunction: function (value) {
            return (value && value[this.readFunctionName]) ? value[this.readFunctionName]() : value;
        },
        writeFunction: function (value, oldValue) {
            if (oldValue && oldValue[this.writeFunctionName]) {
                oldValue[this.writeFunctionName](value);
                return oldValue;
            }
            return value;
        }
    }, classOptions || {}));

    return FunctionValueEditInst;
};

Ribs.mixins.selectEdit = function (classOptions) {
    classOptions = classOptions || {};
    var SelectEditInst = function () {
            var model;
            return _.extend({
                modelName: "data",
                attributeName: null,
                elementSelector: classOptions.attributeName && '[name|="' + classOptions.attributeName + '"]',
                selectOptions: [],

                modelChanging: function () {
                    if (model) {
                        model.unbind("commitEdit", this.commit);
                        model.unbind("cancelEdit", this.redraw);
                    }
                },
                modelChanged: function () {
                    model = this.getMyModel();
                    if (model) {
                        model.bind("commitEdit", this.commit);
                        model.bind("cancelEdit", this.redraw);                        
                    }
                },
                redraw: function () {
                    if (this.el.is("select")) {
                        this.selectEl = this.el;
                    } else {
                        if (this.selectEl) { this.selectEl.remove(); }
                        this.selectEl = $("<select></select>");
                        this.el.append(this.selectEl);
                    }

                    var val = this.getMyValue();
                    _.each(this.selectOptions, _.bind(function (option) {
                        var optionEl = $('<option></option>');
                        optionEl
                                .attr("value", option.value)
                                .text(option.text);
                        if (option.value === val) {
                            optionEl.attr("selected", "selected");
                        }
                        this.selectEl.append(optionEl);
                    }, this));
                },

                commit: function () {
                    if (this.selectEl) {
                        this.setMyValue(this.selectEl.val());
                    }
                }
            }, Ribs.mixinHelpers, classOptions || {});
        };

    return SelectEditInst;
};


Ribs.mixins.textValueEdit = function (classOptions) {
    classOptions = classOptions || {};
    var TextValueEditInst = function () {
            var model;
            return _.extend({
                modelName: "data",
                attributeName: null,
                readFunction: null,
                writeFunction: null,
                elementSelector: classOptions.attributeName && '[name|="' + classOptions.attributeName + '"]',

                bindToModel: function (value) {
                    if (model) {
                        model.unbind("commitEdit", this.commit);
                        model.unbind("cancelEdit", this.redraw);
                    }
                    model = value;
                    if (model) {
                        model.bind("ribs:commitEdit", this.commit);
                        model.bind("ribs:cancelEdit", this.redraw);
                    }
                },
                redraw: function () {
                    var value = this.getMyValue();
                    if (this.readFunction) {
                        value = this.readFunction(value);
                    }
                    this.el.val(value);
                },

                commit: function () {
                    if (this.el) {
                        var value = this.el.val();
                        if (this.writeFunction) {
                            value = this.writeFunction(value, this.getMyValue());
                        }
                        this.setMyValue(value);
                    }
                }
            }, Ribs.mixinHelpers, classOptions || {});
        };

    return TextValueEditInst;
};

Ribs.mixins.cancelEdit = function (classOptions) {
    var CancelEditInst = function () {
            return _.extend({
                modelName: "data",
                events: {
                    "click": "cancel"
                },
                cancel: function () {
                    if (this.model) {
                        this.model.trigger("ribs:cancelEdit");
                    }
                }
            }, classOptions || {});
        };

    return CancelEditInst;
};

Ribs.mixins.commitEdit = function (classOptions) {
    var CommitEditInst = function () {
            return _.extend({
                modelName: "data",
                events: {
                    "click": "commit"
                },
                commit: function () {
                    if (this.model) {
                        this.model.trigger("ribs:commitEdit");
                    }
                }
            }, classOptions || {});
        };
    return CommitEditInst;
};

Ribs.mixins.toggleAttribute = function (classOptions) {
    classOptions = classOptions || {};
    var ToggleAttributeInst = function () {
            return _.extend({
                modelName: "dataUI",
                attributeName: null,
                attributeDefaultValue: false,
                onEvent: "click",
                offEvent: null,

                bindEvents: function () {
                    this.events = {};
                    if (this.onEvent) {
                        this.events[this.onEvent] = "toggleOn";
                    }
                    if (this.offEvent && this.offEvent !== this.onEvent) {
                        this.events[this.offEvent] = "toggleOff";
                    }
                },
                bindToModel: function (model) {
                    this.model = model;
                    if (typeof(this.getMyValue()) === "undefined") {
                        this.setMyValue(this.attributeDefaultValue);
                    }
                },

                toggleOn: function () {
                    var newValue = (this.onEvent === this.offEvent) ? !this.getMyValue() : true;
                    this.setMyValue(newValue);
                },
                toggleOff: function () {
                    if (this.onEvent !== this.offEvent) {
                        this.setMyValue(false);
                    }
                }

            }, Ribs.mixinHelpers, classOptions || {});
        };

    return ToggleAttributeInst;
};

Ribs.mixins.everyOtherChild = function (classOptions) {
    var EveryOtherChildInst = function () {
            return _.extend({
                childClassName: null,

                refresh: function () {
                    if (!this.childClassName) {
                        return;
                    }
                    var odd = false;
                    this.el.children().each(function (index, child) {
                        $(child).toggleClass(this.childClassName, odd);
                        odd = !odd;
                    });
                }
            }, classOptions || {});
        };

    return EveryOtherChildInst;
};

Ribs.mixins.toggleableClass = function (classOptions) {
    classOptions = classOptions || {};
    var ToggleableClassInst = function () {
            return _.extend({
                modelName: "dataUI",
                attributeName: null,
                className: classOptions.attributeName,
                inverse: false,
                
                refresh: function () {
                    var value = this.getMyValue();
                    if (this.inverse) {
                        value = !value;
                    }
                    if (this.el.hasClass(this.className) !== value) {
                        this.el.toggleClass(this.className, value);
                    }
                }
            }, Ribs.mixinHelpers, classOptions || {});
        };

    return ToggleableClassInst;
};

Ribs.mixins.toggleableElement = function (classOptions) {
    var ToggleableElementInst = function (parent) {
            var model, uiEventName;
            return _.extend({
                modelName: "dataUI",
                attributeName: "open",
                inverse: false,

                bindToModel: function (value) {
                    if (model && uiEventName) {
                        model.unbind(uiEventName, this.attributeChanged);
                    }
                    model = this.value;
                    if (model) {
                        uiEventName = "change:" + this.attributeName;
                        model.bind(uiEventName, this.attributeChanged);
                    }
                },
                redraw: function () {
                    var value = this.getMyValue();
                    if (this.inverse) {
                        value = !value;
                    }
                    this.el.toggle(value);
                },

                attributeChanged: function () {
                    parent.invalidated = true;
                }
            }, Ribs.mixinHelpers, classOptions || {});
        };

    return ToggleableElementInst;
};

