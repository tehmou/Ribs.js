// Core classes

/*global $,_,Backbone,console*/

var Ribs = {};

Ribs.VERSION = '0.0.84';

Ribs.mixins = {};

Ribs.mixinMethods = [
    "customInitialize",
    "modelChanging", "modelChanged",
    "render", "redraw", "refresh",
    "unbindEvents", "bindEvents",
    "hide", "dispose"
];

Ribs.createMixed = function (myOptions) {
    myOptions = myOptions || {};

    var Buildee = myOptions.Base ? myOptions.Base.extend() : Ribs.ManagedView.extend(),
        NewRootMixin = Ribs.createMixinFromDefinitions(myOptions),
        OldRootMixin = myOptions.Base && myOptions.Base.RootMixin,

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

Ribs.ManagedView = Backbone.View.extend({
    invalidated: true,

    initialize: function () {
        _.bindAll(this, "customInitialize", "bindToModel", "modelChanging", "modelChanged", "render", "unbindEvents", "redraw", "refresh", "bindEvents", "hide", "dispose");
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
        this.modelChanging();
        if (this.model && this.model.ribsUI) {
             this.model.ribsUI.safeUnbind("all", this.render);
        }
        this.model = model;
        if (this.model) {
            Ribs.augmentModelWithUIAttributes(this.model);
            this.model.ribsUI.bind("all", this.render);
        }
        this.invalidated = true;
        this.modelChanged(model);
    },
    modelChanging: function () { },
    modelChanged: function (newModel) { },
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
        getMixinMyValue = function () {
            if (this.attributeName && this.dataModel) {
                return this.dataModel.get(this.attributeName);
            } else if (this.uiAttributeName) {
                return this.uiModel.get(this.uiAttributeName);
            } else {
                return null;
            }
        },
        setMixinMyValue = function (value) {
            var newValues = {};
            if (this.attributeName && this.dataModel) {
                newValues[this.attributeName] = value;
                return this.dataModel.set(newValues);
            } else if (this.uiAttributeName) {
                newValues[this.uiAttributeName] = value;
                return this.uiModel.set(newValues);
            } else {
                return null;
            }
        },
        eventSplitter = /^(\w+)\s*(.*)$/;

    Ribs.mixins.mixinComposite = function (classOptions) {
        classOptions = classOptions || {};

        var mixinClasses = classOptions.mixinClasses,
                elementSelector = classOptions.elementSelector,
                elementCreator = classOptions.elementCreator,

                MixinCompositeInst = function (parentView, model) {
                    this.customInitialize = function () {
                        this.mixins = [];
                        _.each(this.mixinClasses, _.bind(function (MixinClass) {
                            var mixin = new MixinClass(parentView, model);
                            mixin.getMyValue = getMixinMyValue;
                            mixin.setMyValue = setMixinMyValue;
                            _.bind(function () { _.bindAll(this); }, mixin)();
                            mixin.uiModel = (model && model.ribsUI) || new Backbone.Model();
                            if (mixin.modelChanging) {
                                mixin.modelChanging();
                            }
                            mixin.dataModel = model;
                            if (mixin.modelChanged) {
                                mixin.modelChanged(mixin.dataModel);
                            }
                            this.mixins.push(mixin);
                        }, this));
                        callAllMixins(this.mixins, "customInitialize", arguments);
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
                            if (!mixin || !mixin.events || !mixin.el || !mixin.el.is(":visible")) {
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

                    this.modelChanged = function (newModel) {
                        _.each(this.mixins, _.bind(function (mixin) {
                            mixin.dataModel = newModel;
                            mixin.uiModel = newModel ? newModel.ribsUI : new Backbone.Model();
                            if (mixin.modelChanged) {
                                mixin.modelChanged.apply(mixin, [newModel]);
                            }
                        }, this));
                    };

                    this.redraw = function (parentEl) {
                        this.el = $(parentEl).find(elementSelector);
                        if (this.el.length === 0) {
                            if (elementCreator) {
                                this.el = $(parentEl).append($(elementCreator));
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
                };

        MixinCompositeInst.prototype.mixinClasses = mixinClasses;

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


// Utilities

Ribs.createMixinDefinitionParser = function (parseOne) {
    var parser = { };

    parser.parseOne = parseOne;

    parser.createMixinFromDefinitions = function (mixinDefinitions, elementSelector) {
        mixinDefinitions = mixinDefinitions || [];
        var mixinClasses = [], i, l,
            _parseOne = function (options, name) {
                var MixinClass = parser.parseOne.apply(this, [options, name]);
                mixinClasses.push(MixinClass);
            },
            _createMixinFromDefinitions = function (nestedMixinDefinitions, elementSelector) {
                var MixinClass = parser.createMixinFromDefinitions(nestedMixinDefinitions, elementSelector);
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

        return Ribs.mixins.mixinComposite({
            mixinClasses: mixinClasses,
            elementSelector: elementSelector
        });
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

Ribs.mixins.invalidateOnChange = function (classOptions) {
    var InvalidateOnChangeInst = function (parent) {
            return _.extend({
                excludedAttributes: null,
                includedAttributes: null,
                excludedRibsUIAttributes: null,
                includedRibsUIAttributes: null,

                modelChanging: function () {
                    if (this.dataModel) {
                        this.dataModel.unbind("change", this.change);
                    }
                    if (this.uiModel.safeUnbind) {
                        this.uiModel.safeUnbind("change", this.ribsUIChange);
                    }
                },
                modelChanged: function () {
                    if (this.dataModel) {
                        this.dataModel.bind("change", this.change);
                    }
                    this.uiModel.bind("change", this.ribsUIChange);
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
                },
                ribsUIChange: function (ev) {
                    _.each(ev.changedAttributes(), this.checkUIAttribute);
                },
                checkUIAttribute: function (value, attrName) {
                    var excluded = this.excludedRibsUIAttributes && _.indexOf(this.excludedRibsUIAttributes, attrName) !== -1,
                        included = this.includedRibsUIAttributes && _.indexOf(this.includedRibsUIAttributes, attrName) !== -1;
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
                itemTagName: null,
                itemClassName: null,

                modelChanging: function () {
                    _.each(listViews, function (view) {
                        view.dispose();
                    });
                    listViews = {};
                    if (listModel) {
                        listModel.unbind("add", this.addOne);
                        listModel.unbind("remove", this.removeOne);
                        listModel.unbind("refresh", this.addAll);
                    }
                },
                modelChanged: function () {
                    listModel = this.model && this.model.get(this.attributeName) ? this.model && this.model.get(this.attributeName) : this.dataModel;
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
                    if (listModel.each) {
                        listModel.each(this.addOne);
                    }
                    parent.invalidated = true;
                    parent.render();
                    refreshingList = false;
                },
                removeOne: function (item) {
                    delete listViews[item.cid];
                    $(item.el).remove();
                }
            }, classOptions || {});
        };

    return SimpleListInst;
};

Ribs.mixins.templated = function (classOptions) {
    classOptions = classOptions || {};
    var defaultTemplateFunction = classOptions.templateSelector && _.template($(classOptions.templateSelector)),
        TemplatedInst = function () {
            return _.extend({
                templateSelector: null,
                templateFunction: defaultTemplateFunction,
                className: null,

                redraw: function () {
                    var modelJSON = this.dataModel ? this.dataModel.toJSON() : {},
                        uiModelJSON = this.uiModel.toJSON(),
                        json = _.extend(modelJSON, uiModelJSON);

                    json.t = function (name) {
                        return this.hasOwnProperty(name) ? this[name] : "";
                    };
                    this.el.html(this.templateFunction(json));
                    if (this.className) {
                        this.el.toggleClass(this.className, true);
                    }
                }
            }, classOptions);
        };

    return TemplatedInst;
};

Ribs.mixins.editable = function (classOptions) {
    var EditableInst = Ribs.mixins.mixinComposite(_.extend({
        mixinClasses: [
            Ribs.mixins.toggleAttribute({
                onEvent: "click",
                offEvent: "click",
                uiAttributeName: "editing"
            }),
            Ribs.mixins.toggleableClass({
                className: "editing",
                uiAttributeName: "editing"
            })
        ]
    }, classOptions || {}));

    return EditableInst;
};

Ribs.mixins.editableText = function (classOptions) {
    classOptions = classOptions || {};
    var EditableTextInst = Ribs.mixins.mixinComposite(_.extend({
        mixins: [
            { mixinComposite: {
                elementCreator: "<span>moi</span>",
                mixins: [
                    { toggleableElement: { uiAttributeName: "editing", inverse: true } }
                ]
            }},
            { mixinComposite: {
                elementCreator: "<input type=\"text\" />",
                mixins: [
                    { toggleableElement: { uiAttributeName: "editing" } },
                    { textValueEdit: {
                        attributeName: classOptions.attributeName,
                        uiAttributeName: classOptions.uiAttributeName
                    }}
                ]
            }}
        ]
    }, classOptions || {}));

    return EditableTextInst;
};

Ribs.mixins.hoverable = function (classOptions) {
    var HoverableInst = Ribs.mixins.mixinComposite(_.extend({
        mixinClasses: [
            Ribs.mixins.toggleAttribute({
                onEvent: "mouseenter",
                offEvent: "mouseleave",
                uiAttributeName: "hovering"
            }),
            Ribs.mixins.toggleableClass({
                className: "hovering",
                uiAttributeName: "hovering"
            })
        ]
    }, classOptions || {}));

    return HoverableInst;
};

Ribs.mixins.openable = function (classOptions) {
    var OpenableInst = Ribs.mixins.mixinComposite(_.extend({
        mixinClasses: [
            Ribs.mixins.toggleAttribute({
                onEvent: "click",
                offEvent: "click",
                uiAttributeName: "open"
            }),
            Ribs.mixins.toggleableClass({
                className: "open",
                uiAttributeName: "open"
            })
        ]
    }, classOptions || {}));

    return OpenableInst;
};

Ribs.mixins.selectable = function (classOptions) {
    var SelectableInst = Ribs.mixins.mixinComposite(_.extend({
        mixinClasses: [
            Ribs.mixins.toggleAttribute({
                onEvent: "click",
                offEvent: "click",
                uiAttributeName: "selected"
            }),
            Ribs.mixins.toggleableClass({
                className: "selected",
                uiAttributeName: "selected"
            })
        ]
    }, classOptions || {}));

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
            return _.extend({
                elementSelector: classOptions.attributeName && '[name|="' + classOptions.attributeName + '"]',
                selectOptions: [],

                modelChanging: function () {
                    this.uiModel.unbind("commitEdit", this.commit);
                    this.uiModel.unbind("cancelEdit", this.redraw);
                },
                modelChanged: function () {
                    this.uiModel.bind("commitEdit", this.commit);
                    this.uiModel.bind("cancelEdit", this.redraw);
                },
                redraw: function () {
                    if (this.el.is("select")) {
                        this.selectEl = this.el;
                    } else {
                        if (this.selectEl) { this.selectEl.remove(); }
                        this.selectEl = $("<select></select>");
                        this.el.append(this.selectEl);
                    }

                    var val = this.model && this.model.get(this.attributeName);
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
            }, classOptions || {});
        };

    return SelectEditInst;
};


Ribs.mixins.textValueEdit = function (classOptions) {
    classOptions = classOptions || {};
    var TextValueEditInst = function () {
            return _.extend({
                readFunction: null,
                writeFunction: null,
                elementSelector: (classOptions.attributeName && '[name|="' + classOptions.attributeName + '"]')
                                        || (classOptions.uiAttributeName && '[name|="' + classOptions.uiAttributeName + '"]'),

                modelChanging: function () {
                    this.uiModel.unbind("commitEdit", this.commit);
                    this.uiModel.unbind("cancelEdit", this.redraw);
                },
                modelChanged: function () {
                    this.uiModel.bind("commitEdit", this.commit);
                    this.uiModel.bind("cancelEdit", this.redraw);
                },
                redraw: function () {
                    var value = this.model && this.model.get(this.attributeName);
                    if (this.readFunction) {
                        value = this.readFunction(value);
                    }
                    this.el.val(value);
                },

                commit: function () {
                    if (this.el) {
                        var value = this.el.val();
                        if (this.writeFunction) {
                            value = this.writeFunction(value, this.model && this.model.get(this.attributeName));
                        }
                        this.setMyValue(value);
                    }
                }
            }, classOptions || {});
        };

    return TextValueEditInst;
};

Ribs.mixins.cancelEdit = function (classOptions) {
    var CancelEditInst = function () {
            return _.extend({
                events: {
                    "click": "cancel"
                },
                cancel: function () {
                    this.uiModel.trigger("cancelEdit");
                    this.uiModel.set({ editing: false });
                }
            }, classOptions || {});
        };

    return CancelEditInst;
};

Ribs.mixins.commitEdit = function (classOptions) {
    var CommitEditInst = function () {
            return _.extend({
                events: {
                    "click": "commit"
                },
                commit: function () {
                    this.uiModel.trigger("commitEdit");
                    this.uiModel.set({ editing: false });
                }
            }, classOptions || {});
        };
    return CommitEditInst;
};

Ribs.mixins.toggleAttribute = function (classOptions) {
    classOptions = classOptions || {};
    var ToggleAttributeInst = function () {
            return _.extend({
                events: {},
                attributeDefaultValue: false,
                onEvent: "click",
                offEvent: null,

                bindEvents: function () {
                    if (this.onEvent) {
                        this.events[this.onEvent] = "toggleOn";
                    }
                    if (this.offEvent && this.offEvent !== this.onEvent) {
                        this.events[this.offEvent] = "toggleOff";
                    }
                },

                updateValue: function (newValue) {
                    var values = {};
                    if (this.attributeName && this.dataModel) {
                        values[this.attributeName] = newValue;
                        this.dataModel.set(values);
                    } else if (this.uiAttributeName) {
                        values[this.uiAttributeName] = newValue;
                        this.uiModel.set(values);
                    }
                },
                modelChanged: function (model) {
                    if (typeof(this.model && this.model.get(this.attributeName)) === "undefined") {
                        this.updateValue(this.attributeDefaultValue);
                    }
                },

                toggleOn: function () {
                    var newValue = (this.onEvent === this.offEvent) ? !this.model && this.model.get(this.attributeName) : true;
                    this.updateValue(newValue);
                },
                toggleOff: function () {
                    if (this.onEvent !== this.offEvent) {
                        this.updateValue(false);
                    }
                }

            }, classOptions || {});
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
                className: classOptions.attributeName || classOptions.uiAttributeName,
                inverse: false,
                refresh: function () {
                    var value = this.model && this.model.get(this.attributeName);
                    if (this.inverse) {
                        value = !value;
                    }
                    if (this.el.hasClass(this.className) !== value) {
                        this.el.toggleClass(this.className, value);
                    }
                }
            }, classOptions || {});
        };

    return ToggleableClassInst;
};

Ribs.mixins.toggleableElement = function (classOptions) {
    var ToggleableElementInst = function (parent) {
            var uiEventName;
            return _.extend({
                uiAttributeName: "open",
                inverse: false,

                modelChanging: function () {
                    if (this.uiModel && uiEventName) {
                        this.uiModel.unbind(uiEventName, this.attributeChanged);
                    }
                },
                modelChanged: function () {
                    if (this.uiModel) {
                        uiEventName = "change:" + this.uiAttributeName;
                        this.uiModel.bind(uiEventName, this.attributeChanged);
                    }
                },
                redraw: function () {
                    var value = this.model && this.model.get(this.attributeName);
                    if (this.inverse) {
                        value = !value;
                    }
                    this.el.toggle(value);
                },

                attributeChanged: function () {
                    parent.invalidated = true;
                }
            }, classOptions || {});
        };

    return ToggleableElementInst;
};

