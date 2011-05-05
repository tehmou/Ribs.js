// Core classes

var Ribs = {};

Ribs.VERSION = '0.0.8';

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

    var Buildee = Ribs.ManagedView.extend(),
        NewRootMixin = Ribs.mixins.mixinComposite(myOptions),
        OldRootMixin = myOptions.base && myOptions.base.RootMixin,

        delegateOneToRootMixin = function (methodName) {
            Buildee.prototype[methodName] = function () {
                Ribs.ManagedView.prototype[methodName].apply(this, arguments);
                if (this.rootMixin && this.rootMixin[methodName]) {
                    this.rootMixin[methodName].apply(this.rootMixin, arguments);
                }
            }
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
        this.rootMixin = new Buildee.RootMixin(this, this.options.model);
        Ribs.ManagedView.prototype.initialize.apply(this, arguments);
    };

    return Buildee;
};Ribs.ManagedView = Backbone.View.extend({
    invalidated: true,

    initialize: function () {
        _.bindAll(this, "customInitialize", "bindToModel", "modelChanging", "modelChanged", "render", "unbindEvents", "redraw", "refresh", "bindEvents", "hide", "dispose");
        Backbone.View.prototype.initialize.apply(this, arguments);
        this.model && this.bindToModel(this.model);
        this.customInitialize();
        this.initialized = true;
        this.render();
    },
    customInitialize: function () { },
    bindToModel: function (model) {
        this.modelChanging();
        this.model && this.model.ribsUI && this.model.ribsUI.safeUnbind("all", this.render);
        this.model = model;
        this.model && Ribs.augmentModelWithUIAttributes(this.model);
        this.model && this.model.ribsUI.bind("all", this.render);
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

Ribs.mixins.mixinComposite = function (classOptions) {
    classOptions = classOptions || {};

    var elementSelector = classOptions.elementSelector,
        elementCreator = classOptions.elementCreator,
        mixinClasses = classOptions.mixinClasses || Ribs.parseMixinDefinitions(classOptions.mixins),
        callAllMixins = function (mixins, methodName, originalArguments) {
            _.each(mixins, function (mixin) {
                if (mixin[methodName]) {
                    mixin[methodName].apply(mixin, originalArguments);
                }
            });
        },
        updateMixinEl = function (mixin, el) {
            mixin.el = mixin.elementSelector ? el.find(mixin.elementSelector) : el;
        },
        updateMixinMyValue = function (mixin) {
            if (mixin.attributeName && mixin.model) {
                mixin.myValue = mixin.model.get(mixin.attributeName);
            } else if (mixin.uiAttributeName) {
                mixin.myValue = mixin.ribsUI.get(mixin.uiAttributeName);
            } else {
                mixin.myValue = null;
            }
        },
        eventSplitter = /^(\w+)\s*(.*)$/,
        MixinComposite = function (parentView, model) {
            this.customInitialize = function () {
                this.mixins = [];
                _.each(mixinClasses, _.bind(function (MixinClass) {
                    var mixin = new MixinClass(parentView, model);
                    _.bind(function () { _.bindAll(this); }, mixin)();
                    mixin.ribsUI = (model && model.ribsUI) || new Backbone.Model();
                    if (mixin.modelChanging) {
                        mixin.modelChanging();
                    }
                    mixin.model = model;
                    updateMixinMyValue(mixin);
                    if (mixin.modelChanged) {
                        mixin.modelChanged(mixin.model);
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
                    if (!mixin.events && mixin.bindEvents) {
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
                    mixin.model = newModel;
                    mixin.ribsUI = newModel ? newModel.ribsUI : new Backbone.Model();
                    updateMixinMyValue(mixin);
                    if (mixin.modelChanged) {
                        mixin.modelChanged.apply(mixin, [newModel]);
                    }
                }, this));
            };

            this.redraw = function (parentEl) {
                this.el = $(parentEl).find(elementSelector);
                if (this.el.length == 0) {
                    if (elementCreator) {
                        this.el = $(parentEl).append($(elementCreator));
                    } else {
                        this.el = $(parentEl);
                    }
                }
                _.each(this.mixins, _.bind(function (mixin) {
                    updateMixinMyValue(mixin);
                    updateMixinEl(mixin, this.el);
                    if (mixin.redraw) {
                        mixin.redraw.apply(mixin, [mixin.el]);
                    }
                }, this));
            };

            this.refresh = function () {
                _.each(this.mixins, _.bind(function (mixin) {
                    updateMixinMyValue(mixin);
                    if (mixin.refresh) {
                        mixin.refresh.apply(mixin);
                    }
                }, this));
            };
        };

    _.each(Ribs.mixinMethods, function (methodName) {
        if (!MixinComposite.prototype.hasOwnProperty(methodName)) {
            MixinComposite.prototype[methodName] = function () {
                callAllMixins(this.mixins, methodName, arguments);
            }
        }
    });

    return MixinComposite;
};


// Utilities

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

    Ribs.uiManagers[key] = function () {
        var allowMultiselect = myOptions.allowMultiselect,
            viewModel = new Backbone.Model({ nowHovering: null, nowSelected: null }),
            hoveringChanged = function (event) {
                var item = event[0];
                if (item === viewModel.get("nowHovering") && !item.get("hovering")) {
                    viewModel.set({ nowHovering: null });
                } else if (item !== viewModel.get("nowHovering") && item.get("hovering")) {
                    var lastHovering = viewModel.get("nowHovering");
                    viewModel.set({ nowHovering: item });
                    lastHovering && lastHovering.set({ hovering: false });
                }
            },
            selectedChanged = function (event) {
                var item = event[0];
                if (item === viewModel.get("nowSelected") && !item.get("selected")) {
                    viewModel.set({ nowSelected: null });
                } else if (item !== viewModel.get("nowSelected") && item.get("selected")) {
                    var lastSelected = viewModel.get("nowSelected");
                    viewModel.set({ nowSelected: item });
                    if (!allowMultiselect) {
                        lastSelected && lastSelected.set({ selected: false });
                    }
                }
            },
            register = function (model) {
                if (model) {
                    unregister(model);
                    model.bind("ribsUI:change:hovering", hoveringChanged);
                    model.bind("ribsUI:change:selected", selectedChanged);
                }
            },
            unregister = function (model) {
                if (model) {
                    model.unbind("ribsUI:change:hovering", hoveringChanged);
                    model.unbind("ribsUI:change:selected", selectedChanged);
                }
            };

        return {
            register: register,
            unregister: unregister,
            getViewModel: function () { return viewModel; }
        }
    }();       
};

Ribs.augmentModelWithUIAttributes = function (model) {
    if (!model.hasOwnProperty("ribsUI")) {
        model.ribsUI = new Backbone.Model();

        // Do this until the next version of Backbone.js:
        // https://github.com/documentcloud/backbone/issues/309
        model.ribsUI.safeUnbind = function (ev, callback) {
            var calls;
            if (!ev) {
                this._callbacks = {};
            } else if (calls = this._callbacks) {
                if (!callback) {
                    calls[ev] = [];
                } else {
                    var list = calls[ev];
                    if (!list) return this;
                    for (var i = 0, l = list.length; i < l; i++) {
                        if (callback === list[i]) {
                            list[i] = function () { };
                            break;
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

Ribs.parseMixinDefinitions = function (mixinDefinitions) {
    mixinDefinitions = mixinDefinitions || [];
    var mixinClasses = [];

    if (_.isArray(mixinDefinitions)) {
        for (var i = 0, l = mixinDefinitions.length; i < l; i++) {
            var mixinDefinitionObject = mixinDefinitions[i];
            _.each(mixinDefinitionObject, function (options, name) {
                var mixinFunction = Ribs.mixins[name]
                if (!mixinFunction) {
                    throw "Could not find mixin " + name;
                }
                mixinClasses.push(mixinFunction(options));
            });
        }
    } else {
        _.each(mixinDefinitions,
            function (nestedMixinDefinitionArray, elementSelector) {
                MixinComposite = Ribs.mixins.mixinComposite({
                    mixins: nestedMixinDefinitionArray,
                    elementSelector: elementSelector
                });
                mixinClasses.push(MixinComposite);
            }
        );
    }
    return mixinClasses;
};

Ribs.log = function (msg) {
    if (typeof(console) != "undefined") {
        console.log(msg);
    }
};


// Default mixin classes

Ribs.mixins.invalidateOnChange = function (classOptions) {
    classOptions = classOptions || {};

    var excludedAttributes = classOptions.excludedAttributes || null,
        includedAttributes = classOptions.includedAttributes || null,
        excludedRibsUIAttributes = classOptions.excludedRibsUIAttributes || null,
        includedRibsUIAttributes = classOptions.includedRibsUIAttributes || null,
        InvalidateOnChange = function (parent) {
            return {
                attributeName: classOptions.attributeName,
                uiAttributeName: classOptions.uiAttributeName,
                elementSelector: classOptions.elementSelector,
                modelChanging: function () {
                    if (this.model) {
                        this.model.unbind("change", this.change);
                    }
                    if (this.ribsUI.safeUnbind) {
                        this.ribsUI.safeUnbind("change", this.ribsUIChange);
                    }
                },
                modelChanged: function () {
                    if (this.model) {
                        this.model.bind("change", this.change);
                    }
                    this.ribsUI.bind("change", this.ribsUIChange);
                },
                change: function (ev) {
                    _.each(ev.changedAttributes(), this.checkAttribute);
                },
                checkAttribute: function (value, attrName) {
                    var excluded = excludedAttributes && excludedAttributes.indexOf(attrName) != -1,
                        included = includedAttributes && includedAttributes.indexOf(attrName) != -1;
                    if (!excluded && included && !parent.invalidated) {
                        parent.invalidated = true;
                        _.defer(parent.render);
                    }
                },
                ribsUIChange: function (ev) {
                    _.each(ev.changedAttributes(), this.checkUIAttribute);
                },
                checkUIAttribute: function (value, attrName) {
                    var excluded = excludedRibsUIAttributes && excludedRibsUIAttributes.indexOf(attrName) != -1,
                        included = includedRibsUIAttributes && includedRibsUIAttributes.indexOf(attrName) != -1;
                    if (!excluded && included && !parent.invalidated) {
                        parent.invalidated = true;
                        _.defer(parent.render);
                    }
                }
            };
        };

    return InvalidateOnChange;
};

Ribs.mixins.simpleList = function (classOptions) {
    classOptions = classOptions || {};

    var ItemRenderer = classOptions.ItemRenderer,
        itemTagName = classOptions.itemTagName || null,
        itemClassName = classOptions.itemClassName || null,
        SimpleList = function (parent) {
            var listModel, listViews;
            return {
                attributeName: classOptions.attributeName,
                uiAttributeName: classOptions.uiAttributeName,
                elementSelector: classOptions.elementSelector,
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
                    listModel = this.myValue ? this.myValue : this.model;
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
                            tagName: itemTagName,
                            className: itemClassName
                        });
                        listViews[item.cid] = listView;
                        if (!this.refreshingList) {
                            parent.invalidated = true;
                            parent.render();
                        }
                    }
                },
                addAll: function () {
                    this.refreshingList = true;
                    if (listModel.each) {
                        listModel.each(this.addOne);
                    }
                    parent.invalidated = true;
                    parent.render();
                    this.refreshingList = false;
                },
                removeOne: function (item) {
                    delete listViews[item.cid];
                    $(item.el).remove();
                }
            };
        };

    return SimpleList;
};

Ribs.mixins.templated = function (classOptions) {
    classOptions = classOptions || {};

    var templateFunction = classOptions.templateFunction,
        className = classOptions.className,
        Templated = function () {
            return {
                attributeName: classOptions.attributeName,
                uiAttributeName: classOptions.uiAttributeName,
                elementSelector: classOptions.elementSelector,
                redraw: function () {
                    var modelJSON = this.model ? this.model.toJSON() : {},
                        uiModelJSON = this.ribsUI.toJSON(),
                        json = _.extend(modelJSON, uiModelJSON);

                    json.t = function (name) {
                        return this.hasOwnProperty(name) ? this[name] : "";
                    };
                    this.el.html(templateFunction(json));
                    if (className) {
                        this.el.toggleClass(className, true);
                    }
                }
            };
        };

    return Templated;
};

Ribs.mixins.editable = function (classOptions) {
    classOptions = classOptions || {};
    var Editable = Ribs.mixins.mixinComposite(_.extend(classOptions, {
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
    }));

    return Editable;
};

Ribs.mixins.editableText = function (classOptions) {
    classOptions = classOptions || {};
    var EditableText = Ribs.mixins.mixinComposite(_.extend(classOptions, {
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
    }));

    return EditableText;
};

Ribs.mixins.hoverable = function (classOptions) {
    classOptions = classOptions || {};
    var Hoverable = Ribs.mixins.mixinComposite(_.extend(classOptions, {
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
    }));

    return Hoverable;
};

Ribs.mixins.openable = function (classOptions) {
    classOptions = classOptions || {};
    var Openable = Ribs.mixins.mixinComposite(_.extend(classOptions, {
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
    }));

    return Openable;
};

Ribs.mixins.selectable = function (classOptions) {
    classOptions = classOptions || {};
    var Selectable = Ribs.mixins.mixinComposite(_.extend(classOptions, {
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
    }));

    return Selectable;
};

Ribs.mixins.selectEdit = function (classOptions) {
    classOptions = classOptions || {};
    var attributeName = classOptions.attributeName,
        selectOptions = classOptions.options,
        elementSelector = attributeName && '[name|="' + attributeName + '"]';

    var SelectEdit = function () {
        return {
            attributeName: classOptions.attributeName,
            uiAttributeName: classOptions.uiAttributeName,
            elementSelector: elementSelector,
            modelChanging: function () {
                this.ribsUI.unbind("commitEdit", this.commit);
                this.ribsUI.unbind("cancelEdit", this.redraw);
            },
            modelChanged: function () {
                this.ribsUI.bind("commitEdit", this.commit);
                this.ribsUI.bind("cancelEdit", this.redraw);
            },
            redraw: function () {
                if (this.el.is("select")) {
                    this.selectEl = this.el;
                } else {
                    if (this.selectEl) { this.selectEl.remove(); }
                    this.selectEl = $("<select></select>");
                    this.el.append(this.selectEl);
                }

                if (this.model) {
                    var val = this.model.get(attributeName);
                    _.each(selectOptions, _.bind(function (option) {
                        var optionEl = $('<option></option>')
                        optionEl
                                .attr("value", option.value)
                                .text(option.text);
                        if (option.value === val) {
                            optionEl.attr("selected", "selected");
                        }
                        this.selectEl.append(optionEl);
                    }, this));
                }
            },

            commit: function () {
                var value = this.selectEl.val(), values = {};
                values[attributeName] = value;
                this.model.set(values);
            }
        };
    };

    return SelectEdit;
};

Ribs.mixins.textValueEdit = function (classOptions) {
    classOptions = classOptions || {};

    var attributeName = classOptions.attributeName,
        elementSelector = attributeName && '[name|="' + attributeName + '"]';

    var TextValueEdit = function () {
            return {
                attributeName: classOptions.attributeName,
                uiAttributeName: classOptions.uiAttributeName,
                elementSelector: elementSelector,
                modelChanging: function () {
                    this.ribsUI.unbind("commitEdit", this.commit);
                    this.ribsUI.unbind("cancelEdit", this.redraw);
                },
                modelChanged: function () {
                    this.ribsUI.bind("commitEdit", this.commit);
                    this.ribsUI.bind("cancelEdit", this.redraw);
                },
                redraw: function () {
                    if (this.model) {
                        this.el.val(this.model.get(attributeName));
                    }
                },

                commit: function () {
                    var value = this.el.val(), values = {};
                    values[attributeName] = value;
                    this.model.set(values);
                }
            };
        };

    return TextValueEdit;
};

Ribs.mixins.cancelEdit = function (classOptions) {
    classOptions = classOptions || {};
    var CancelEdit = function () {
            return {
                attributeName: classOptions.attributeName,
                uiAttributeName: classOptions.uiAttributeName,
                elementSelector: classOptions.elementSelector,
                events: {
                    "click": "cancel"
                },
                cancel: function () {
                    this.ribsUI.trigger("cancelEdit");
                    this.ribsUI.set({ editing: false });
                }
            };
        };

    return CancelEdit;
};

Ribs.mixins.commitEdit = function (classOptions) {
    classOptions = classOptions || {};
    var CommitEdit = function () {
            return {
                attributeName: classOptions.attributeName,
                uiAttributeName: classOptions.uiAttributeName,
                elementSelector: classOptions.elementSelector,
                events: {
                    "click": "commit"
                },
                commit: function () {
                    this.ribsUI.trigger("commitEdit");
                    this.ribsUI.set({ editing: false });
                }
            };
        };

    return CommitEdit;
};

Ribs.mixins.toggleAttribute = function (classOptions) {
    classOptions = classOptions || {};

    var attributeName = classOptions.attributeName,
        uiAttributeName = classOptions.uiAttributeName,
        attributeDefaultValue = classOptions.attributeDefaultValue || false,
        onEvent = (typeof(classOptions.onEvent) != "undefined") ? classOptions.onEvent : "click",
        offEvent = classOptions.offEvent,
        sameEvent = (typeof(classOptions.sameEvent) != "undefined") ? classOptions.sameEvent : (onEvent === offEvent),
    
        ToggleAttribute = function () {
            var events = {};
            if (onEvent) {
                events[onEvent] = "toggleOn";
            }
            if (!sameEvent && offEvent) {
                events[offEvent] = "toggleOff";
            }
            return {
                events: events,
                attributeName: attributeName,
                uiAttributeName: uiAttributeName,
                elementSelector: classOptions.elementSelector,
                updateValue: function (newValue) {
                    var values = {};
                    if (attributeName) {
                        values[attributeName] = newValue;
                        this.model.set(values);
                    } else if (uiAttributeName) {
                        values[uiAttributeName] = newValue;
                        this.ribsUI.set(values);
                    }
                },
                modelChanged: function (model) {
                    if (typeof(this.myValue) == "undefined") {
                        this.updateValue(attributeDefaultValue);
                    }
                },

                toggleOn: function () {
                    var newValue = sameEvent ? !this.myValue : true;
                    this.updateValue(newValue);
                },
                toggleOff: function () {
                    if (!sameEvent) {
                        this.updateValue(false);
                    }
                }

            };
        };

    return ToggleAttribute;
};

Ribs.mixins.everyOtherChild = function (classOptions) {
    classOptions = classOptions || {};

    var childClassName = classOptions.childClassName || null,
        EveryOtherChild = function () {
            return {
                attributeName: classOptions.attributeName,
                uiAttributeName: classOptions.uiAttributeName,
                elementSelector: classOptions.elementSelector,
                refresh: function () {
                    if (!childClassName) {
                        return;
                    }
                    var odd = false;
                    this.el.children().each(function (index, child) {
                        $(child).toggleClass(childClassName, odd);
                        odd = !odd;
                    });
                }
            };
        };

    return EveryOtherChild;
};

Ribs.mixins.toggleableClass = function (classOptions) {
    classOptions = classOptions || {};

    var className = classOptions.className || classOptions.attributeName || classOptions.uiAttributeName,
        inverse = classOptions.inverse || false,
    
        ToggleableClass = function () {
            return {
                attributeName: classOptions.attributeName,
                uiAttributeName: classOptions.uiAttributeName,
                elementSelector: classOptions.elementSelector,
                refresh: function () {
                    var value = this.myValue;
                    if (inverse) {
                        value = !value;
                    }
                    if (this.el.hasClass(className) != value) {
                        this.el.toggleClass(className, value);
                    }
                }
            };
        };

    return ToggleableClass;
};

Ribs.mixins.toggleableElement = function (classOptions) {
    classOptions = classOptions || {};

    var inverse = classOptions.inverse || false,
        uiAttributeName = classOptions.uiAttributeName || "open",
        uiEventName = "change:" + uiAttributeName,

        ToggleableElement = function (parent) {
            return {
                attributeName: classOptions.attributeName,
                uiAttributeName: uiAttributeName,
                elementSelector: classOptions.elementSelector,
                modelChanging: function () {
                    if (this.ribsUI) {
                        this.ribsUI.unbind(uiEventName, this.attributeChanged);
                    }
                },
                modelChanged: function () {
                    if (this.ribsUI) {
                        this.ribsUI.bind(uiEventName, this.attributeChanged);
                    }
                },
                redraw: function () {
                    var value = this.myValue;
                    inverse && (value = !value);
                    this.el.toggle(value);
                },

                attributeChanged: function () {
                    parent.invalidated = true;
                }
            };
        };

    return ToggleableElement;
};

