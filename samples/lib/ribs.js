(function(){
    var Ribs, resolveMixinClasses;

    Ribs = this.Ribs = {};

    Ribs.VERSION = '0.0.1';

    Ribs.mixins = {};

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

    resolveMixinClasses = function (classOptions) {
        var mixins = [],
            mixinDefinions = classOptions.mixins || [];

        for (var i = 0, l = mixinDefinions.length; i < l; i++) {

            var def = mixinDefinions[i];

            _.each(def, function (options, name) {
                var mixinFunction = Ribs.mixins[name]
                if (!mixinFunction) {
                    throw "Could not find mixin " + name;
                }

                mixins.push(mixinFunction(options));
            });
        }
        return mixins;
    };

    Ribs.createMixed = function (classOptions) {
        classOptions = classOptions || {};

        var requireModel = classOptions.hasOwnProperty("requireModel") ? classOptions.requireModel : true,
            mixinClasses = classOptions.mixinClasses || resolveMixinClasses(classOptions),
            base = classOptions.base || null,
            Buildee = Ribs.ManagedView.extend(),
            delegateOneToMixins = function (methodName) {
                Buildee.prototype[methodName] = function () {
                    var doIt = function () {
                        Ribs.ManagedView.prototype[methodName].apply(this, arguments);
                        _.each(this.mixins, _.bind(function (mixin) {
                            mixin[methodName] && mixin[methodName].apply(mixin, arguments);
                        }, this));
                    };
    
                    doIt.apply(this, arguments);
                }
            },
            delegateToMixins = function (methods) {
                _.each(methods, function (methodName) { delegateOneToMixins(methodName); });
            };

        Buildee.prototype.initialize = function () {
            if (requireModel && !this.model) {
                throw "No model specified and requireModel==true";
            }
            var mixinClasses = this.getMixinClasses();
            this.mixins = [];
            _.each(mixinClasses, _.bind(function (Mixin) {
                var mixin = new Mixin();
                mixin.parent = this;
                this.mixins.push(mixin);
            }, this));


            Ribs.ManagedView.prototype.initialize.apply(this, arguments);
        };

        Buildee.prototype.delegateEvents = function () {
            Backbone.View.prototype.delegateEvents.apply(this, arguments);
            _.each(this.mixins, function (mixin) {
                Backbone.View.prototype.delegateEvents.apply(mixin);
            });
        };
        delegateToMixins(["customInitialize", "modelChanged", "render", "redraw", "refresh", "hide", "dispose"]);

        Buildee.prototype.getMixinClasses = function () {
            var oldMixinClasses = [];
            if (base && base.prototype.getMixinClasses) {
                oldMixinClasses = base.prototype.getMixinClasses.apply(this, arguments);
            }
            return oldMixinClasses.concat(mixinClasses);
        };

        return Buildee;
    };

})();

Ribs.ManagedView = Backbone.View.extend({
    invalidated: true,
    refreshOnlyIfVisible: false,

    initialize: function () {
        _.bindAll(this, "customInitialize", "bindToModel", "modelChanged", "render", "redraw", "refresh", "hide", "dispose");
        Backbone.View.prototype.initialize.apply(this, arguments);
        this.customInitialize();
        this.model && this.bindToModel(this.model);
        this.render();
    },
    customInitialize: function () { },
    bindToModel: function (model) {
        this.model && this.model.ribsUI && this.model.ribsUI.safeUnbind("all", this.render);
        this.model = model;
        this.model && Ribs.augmentModelWithUIAttributes(this.model);
        this.modelChanged();
        this.model && this.model.ribsUI.bind("all", this.render);
        this.invalidated = true;
    },
    modelChanged: function () { },
    render: function () {
        if (this.invalidated) {
            this.redraw();
            this.invalidated = false;
        }
        $(this.el).unbind();
        this.delegateEvents();
        if (!this.refreshOnlyIfVisible || $(this.el).is(":visible")) {
            this.refresh();
        }
    },
    redraw: function () { },
    refresh: function () { },
    hide: function () {
        $(this.el).detach();
    },
    dispose: function () {
        $(this.el).remove();
    }
});

Ribs.createUIManager = function (key, classOptions) {
    classOptions = classOptions || {};

    Ribs.uiManagers = Ribs.uiManagers || {};

    Ribs.uiManagers[key] = function () {
        var allowMultiselect = classOptions.allowMultiselect,
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

Ribs.mixins.invalidateOnChange = function (classOptions) {
    classOptions = classOptions || {};

    var excludedAttributes = classOptions.excludedAttributes || null,
        includedAttributes = classOptions.includedAttributes || null,
        excludedRibsUIAttributes = classOptions.excludedRibsUIAttributes || null,
        includedRibsUIAttributes = classOptions.includedRibsUIAttributes || null,
        InvalidateOnChange = function () {
            return _.extend(new Ribs.MixinBase(classOptions),
            {
                modelChanged: function () {
                    if (this.model) {
                        this.model.unbind("change", this.change);
                        this.model.ribsUI.unbind("change", this.ribsUIChange);
                    }
                    Ribs.MixinBase.prototype.modelChanged.apply(this, arguments);
                    if (this.model) {
                        this.model.bind("change", this.change);
                        this.model.ribsUI.bind("change", this.ribsUIChange);
                    }
                },

                change: function (ev) {
                    var excluded = excludedAttributes && excludedAttributes.indexOf(ev) != -1,
                        included = includedAttributes && includedAttributes.indexOf(ev) != -1;
                    if (!excluded && included) {
                        this.parent.invalidated = true;
                        _.defer(this.parent.render());
                    }
                },
                ribsUIChange: function (ev) {
                    var excluded = excludedRibsUIAttributes && excludedRibsUIAttributes.indexOf(ev) != -1,
                        included = includedRibsUIAttributes && includedRibsUIAttributes.indexOf(ev) != -1;
                    if (!excluded && included) {
                        this.parent.invalidated = true;
                        _.defer(this.parent.render());
                    }
                }
            });
            return mixin;
        };

    return InvalidateOnChange;
};

Ribs.mixins.simpleList = function (classOptions) {
    classOptions = classOptions || {};

    var listAttributeName = classOptions.listAttributeName,
        ItemRenderer = classOptions.ItemRenderer,
        itemTagName = classOptions.itemTagName || null,
        itemClassName = classOptions.itemClassName || null,
        SimpleList = function () {
            var listModel, listViews;
            return _.extend(new Ribs.MixinBase(classOptions),
            {
                modelChanged: function () {
                    Ribs.MixinBase.prototype.modelChanged.apply(this, arguments);
                    _.each(listViews, function (view) {
                        view.dispose();
                    });
                    listViews = {};
                    if (listModel) {
                        listModel.unbind("add", mixin.addOne);
                        listModel.unbind("remove", mixin.removeOne);
                        listModel.unbind("refresh", mixin.addAll);
                    }
                    if (this.model) {
                        listModel = listAttributeName ? this.model.get(listAttributeName) : this.model;
                        listModel.bind("add", this.addOne);
                        listModel.bind("remove", this.removeOne);
                        listModel.bind("refresh", this.addAll);
                        this.addAll();
                    } else {
                        this.model = null;
                    }
                },
                redraw: function () {
                    Ribs.MixinBase.prototype.redraw.apply(this, arguments);
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
                        this.parent.invalidated = true;
                    }
                },
                addAll: function () {
                    listModel.each(this.addOne);
                },
                removeOne: function (item) {
                    delete listViews[item.cid];
                    $(item.el).remove();
                }
            });
        };

    return SimpleList;
};

Ribs.mixins.templated = function (classOptions) {
    classOptions = classOptions || {};

    var templateFunction = classOptions.templateFunction,
        className = classOptions.className,
        Templated = function () {
            return _.extend(new Ribs.MixinBase(classOptions),
            {
                redraw: function () {
                    Ribs.MixinBase.prototype.redraw.apply(this, arguments);

                    var json = this.model ? (this.model.toJSON ? this.model.toJSON() : this.model) : {};
                    json.t = function (name) {
                        return this.hasOwnProperty(name) ? this[name] : "";
                    };
                    this.el.html(templateFunction(json));
                    if (className) {
                        this.el.toggleClass(className, true);
                    }
                }
            });
            return mixin;
        };

    return Templated;
};

Ribs.mixins.selectEdit = function (classOptions) {
    classOptions = classOptions || {};

    var attributeName = classOptions.attributeName,
        selectOptions = classOptions.options;

    if (attributeName && !classOptions.elementSelector) {
        classOptions.elementSelector = '[name|="' + attributeName + '"]';
    }

    var SelectEdit = function () {
        return _.extend(new Ribs.MixinBase(classOptions),
        {
            modelChanged: function () {
                if (this.model) {
                    this.model.unbind("ribsUI:commitEdit", this.commit);
                    this.model.unbind("ribsUI:cancelEdit", this.redraw);
                }
                Ribs.MixinBase.prototype.modelChanged.apply(this, arguments);
                if (this.model) {
                    this.model.bind("ribsUI:commitEdit", this.commit);
                    this.model.bind("ribsUI:cancelEdit", this.redraw);
                }
            },
            redraw: function () {
                Ribs.MixinBase.prototype.redraw.apply(this, arguments);
                if (this.el.is("select")) {
                    this.selectEl = this.el;
                } else {
                    if (this.selectEl) { this.selectEl.remove(); }
                    this.selectEl = $("<select></select>");
                    this.el.append(this.selectEl);
                }

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
            },

            commit: function () {
                var value = this.selectEl.val(), values = {};
                values[attributeName] = value;
                this.model.set(values);
            }
        });
    };

    return SelectEdit;
};

Ribs.mixins.textValueEdit = function (classOptions) {
    classOptions = classOptions || {};

    var attributeName = classOptions.attributeName;

    if (attributeName && !classOptions.elementSelector) {
        classOptions.elementSelector = '[name|="' + attributeName + '"]';
    }

    var TextValueEdit = function () {
        return _.extend(new Ribs.MixinBase(classOptions),
        {
            modelChanged: function () {
                if (this.model) {
                    this.model.unbind("ribsUI:commitEdit", this.commit);
                    this.model.unbind("ribsUI:cancelEdit", this.redraw);
                }
                Ribs.MixinBase.prototype.modelChanged.apply(this, arguments);
                if (this.model) {
                    this.model.bind("ribsUI:commitEdit", this.commit);
                    this.model.bind("ribsUI:cancelEdit", this.redraw);
                }
            },
            redraw: function () {
                Ribs.MixinBase.prototype.redraw.apply(this, arguments);
                this.el.val(this.model.get(attributeName));
            },

            commit: function () {
                var value = this.el.val(), values = {};
                values[attributeName] = value;
                this.model.set(values);
            }
        });
    };

    return TextValueEdit;
};

Ribs.mixins.cancelEdit = function (classOptions) {
    var CancelEdit = function () {
            return _.extend(new Ribs.MixinBase(classOptions), {
                events: {
                    "click": "cancel"
                },
                cancel: function () {
                    this.model.ribsUI.trigger("cancelEdit");
                    this.model.ribsUI.set({ editing: false });
                }
            });
        };

    return CancelEdit;
};

Ribs.mixins.commitEdit = function (classOptions) {
    var CommitEdit = function () {
            return _.extend(new Ribs.MixinBase(classOptions), {
                events: {
                    "click": "commit"
                },
                commit: function () {
                    this.model.ribsUI.trigger("commitEdit");
                    this.model.ribsUI.set({ editing: false });
                }
            });
        };

    return CommitEdit;
};

Ribs.mixins.editable = function (classOptions) {
    classOptions = classOptions || {};

    var forceShow = classOptions.forceShow || false,
        Editable = function () {
            return _.extend(new Ribs.MixinBase(classOptions), {
                events: {
                    "click": "edit"
                },
                modelChanged: function () {
                    Ribs.MixinBase.prototype.modelChanged.apply(this, arguments);
                    if (this.model && !this.model.ribsUI.attributes.hasOwnProperty("editing")) {
                        this.model.ribsUI.set({ editing: false });
                    }
                },
                refresh: function () {
                    if (forceShow) {
                        this.el.toggle(true);                        
                    }
                },

                edit: function () {
                    this.model.ribsUI.set({ editing: true });
                }
            });
        };

    return Editable;
};

Ribs.mixins.hoverable = function (classOptions) {
    var Hoverable = function () {
            return _.extend(new Ribs.MixinBase(classOptions),
            {
                modelChanged: function () {
                    Ribs.MixinBase.prototype.modelChanged.apply(this, arguments);
                    this.model && this.model.ribsUI.set({ hovering: false });
                },
                refresh: function () {
                    this.el
                            .mouseenter(this.mouseOver)
                            .mouseleave(this.mouseOut)
                            .toggleClass("hovering", this.model.ribsUI.get("hovering"));
                },

                mouseOver: function () {
                    this.model.ribsUI.set({ hovering: true });
                },
                mouseOut: function () {
                    this.model.ribsUI.set({ hovering: false });
                }
            });
        };

    return Hoverable;
};

Ribs.mixins.selectable = function (classOptions) {
    var Selectable = function () {
            return _.extend(new Ribs.MixinBase(classOptions),
            {
                events: {
                    "click": "elementClicked"
                },
                modelChanged: function () {
                    Ribs.MixinBase.prototype.modelChanged.apply(this, arguments);
                    this.model && this.model.ribsUI.set({ selected: false });
                },
                refresh: function () {
                    this.el.toggleClass("selected", this.model.ribsUI.get("selected"));
                },

                elementClicked: function () {
                    this.model.ribsUI.set({ selected: !this.model.ribsUI.get("selected") });
                }
            });
        };
    
    return Selectable;
};

Ribs.mixins.toggleButton = function (classOptions) {
    classOptions = classOptions || {};

    var usePlusMinus = classOptions.usePlusMinus || false,
        ToggleButton = function () {
            return _.extend(new Ribs.MixinBase(classOptions),
            {
                events: {
                    "click": "toggle"
                },
                modelChanged: function () {
                    Ribs.MixinBase.prototype.modelChanged.apply(this, arguments);
                    this.model && this.model.ribsUI.set({ open: false });
                },
                refresh: function () {
                    if (usePlusMinus) {
                        this.el.text(this.model.ribsUI.get("open") ? "-" : "+");
                    }
                    this.el.toggleClass("open", this.model.ribsUI.get("open"));
                },


                toggle: function () {
                    this.model.ribsUI.set({ open: !this.model.ribsUI.get("open") });
                }
            });
        };

    return ToggleButton;
};

Ribs.MixinBase = function (classOptions) {
    this.classOptions = classOptions || {};
};

Ribs.MixinBase.prototype.customInitialize = function () {
    _.bindAll(this);
};

Ribs.MixinBase.prototype.modelChanged = function () {
    this.model = this.parent.model;
};

Ribs.MixinBase.prototype.redraw = function () {
    var selector = this.classOptions.elementSelector || this.classOptions.es;
    if (selector) {
        this.el = $(this.parent.el).find(selector);
    } else {
        this.el = $(this.parent.el);
    }
};
Ribs.mixins.everyOtherChild = function (classOptions) {
    classOptions = classOptions || {};

    var childClassName = classOptions.childClassName || null,
        EveryOtherChild = function () {
            return _.extend(new Ribs.MixinBase(classOptions),
            {
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
            });
        };

    return EveryOtherChild;
};

Ribs.mixins.toggleableClass = function (classOptions) {
    classOptions = classOptions || {};

    var uiAttributeName = classOptions.uiAttributeName || "selected",
        className = classOptions.className || uiAttributeName,
        inverse = classOptions.inverse || false,
        ToggleableClass = function () {
            return _.extend(new Ribs.MixinBase(classOptions),
            {
                modelChanged: function () {
                    var ev = "change:" + uiAttributeName;
                    if (this.model) {
                        this.model.ribsUI.unbind(ev, this.attributeChanged);
                    }
                    Ribs.MixinBase.prototype.modelChanged.apply(this, arguments);
                    if (this.model) {
                        this.model.ribsUI.bind(ev, this.attributeChanged);
                    }
                },
                redraw: function () {
                    Ribs.MixinBase.prototype.redraw.apply(this, arguments);
                    var value = this.model.ribsUI.get(uiAttributeName);
                    inverse && (value = !value);
                    this.el.toggleClass(className, value);
                },


                attributeChanged: function () {
                    this.parent && (this.parent.invalidated = true);
                }
            });
        };

    return ToggleableClass;
};

Ribs.mixins.toggleableElement = function (classOptions) {
    classOptions = classOptions || {};

    var uiAttributeName = classOptions.uiAttributeName || "open",
        inverse = classOptions.inverse || false,
        ToggleableElement = function () {
            return _.extend(new Ribs.MixinBase(classOptions),
            {
                modelChanged: function () {
                    var ev = "change:" + uiAttributeName;
                    if (this.model) {
                        this.model.ribsUI.unbind(ev, this.attributeChanged);
                    }
                    Ribs.MixinBase.prototype.modelChanged.apply(this, arguments);
                    if (this.model) {
                        this.model.ribsUI.bind(ev, this.attributeChanged);
                    }
                },
                redraw: function () {
                    Ribs.MixinBase.prototype.redraw.apply(this, arguments);
                    var value = this.model.ribsUI.get(uiAttributeName);
                    inverse && (value = !value);
                    this.el.toggle(value);
                },


                attributeChanged: function () {
                    this.parent && (this.parent.invalidated = true);
                }
            });
        };

    return ToggleableElement;
};

