(function(){
    var Ribs;

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

    Ribs.createMixed = function (myOptions) {
        myOptions = myOptions || {};

        var requireModel = myOptions.hasOwnProperty("requireModel") ? myOptions.requireModel : true,
            mixinClasses = myOptions.mixinClasses,
            base = myOptions.base || null,
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

Ribs.createUIManager = function (key, myOptions) {
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

Ribs.mixins.invalidateOnChange = function (myOptions) {
    myOptions = myOptions || {};

    var excludedAttributes = myOptions.excludedAttributes || null,
        includedAttributes = myOptions.includedAttributes || null,
        excludedRibsUIAttributes = myOptions.excludedRibsUIAttributes || null,
        includedRibsUIAttributes = myOptions.includedRibsUIAttributes || null,
        InvalidateOnChange = function () {
            return _.extend(new Ribs.MixinBase(myOptions),
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

Ribs.mixins.simpleList = function (myOptions) {
    myOptions = myOptions || {};

    var listAttributeName = myOptions.listAttributeName,
        ItemRenderer = myOptions.ItemRenderer,
        SimpleList = function () {
            var listModel, listViews;
            return _.extend(new Ribs.MixinBase(myOptions),
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
                        var listView = new ItemRenderer({ model: item });
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

Ribs.mixins.templated = function (myOptions) {
    myOptions = myOptions || {};

    var templateFunction = myOptions.templateFunction,
        className = myOptions.className,
        Templated = function () {
            return _.extend(new Ribs.MixinBase(myOptions),
            {
                redraw: function () {
                    Ribs.MixinBase.prototype.redraw.apply(this, arguments);

                    var json = this.model ? (this.model.toJSON ? this.model.toJSON() : this.model) : {};
                    json.t = function (name) {
                        return this.hasOwnProperty(name) ? this[name] : "";
                    };
                    this.el.html(templateFunction(json));
                    className && this.el.toggleClass(className, true);
                }
            });
            return mixin;
        };

    return Templated;
};

Ribs.mixins.toggleableElement = function (myOptions) {
    myOptions = myOptions || {};

    var uiAttributeName = myOptions.uiAttributeName || "open",
        inverse = myOptions.inverse || false,
        ToggleableElement = function () {
            return _.extend(new Ribs.MixinBase(myOptions),
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

Ribs.mixins.textValueEdit = function (myOptions) {
    myOptions = myOptions || {};

    var attributeName = myOptions.attributeName;

    if (attributeName && !myOptions.elementSelector) {
        myOptions.elementSelector = '[name|="' + attributeName + '"]';
    }

    var TextValueEdit = function () {
        return _.extend(new Ribs.MixinBase(myOptions),
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

Ribs.mixins.cancelEdit = function (myOptions) {
    var CancelEdit = function () {
            return _.extend(new Ribs.MixinBase(myOptions), {
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

Ribs.mixins.commitEdit = function (myOptions) {
    var CommitEdit = function () {
            return _.extend(new Ribs.MixinBase(myOptions), {
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

Ribs.mixins.editable = function (myOptions) {
    var Editable = function () {
            return _.extend(new Ribs.MixinBase(myOptions), {
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
                    this.el.toggle(true);
                },

                edit: function () {
                    this.model.ribsUI.set({ editing: true });
                }
            });
        };

    return Editable;
};

Ribs.mixins.hoverable = function (myOptions) {
    var Hoverable = function () {
            return _.extend(new Ribs.MixinBase(myOptions),
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

Ribs.mixins.selectable = function (myOptions) {
    var Selectable = function () {
            return _.extend(new Ribs.MixinBase(myOptions),
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

Ribs.mixins.toggleButton = function (myOptions) {
    myOptions = myOptions || {};

    var usePlusMinus = myOptions.usePlusMinus || false,
        ToggleButton = function () {
            return _.extend(new Ribs.MixinBase(myOptions),
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

Ribs.MixinBase = function (myOptions) {
    this.myOptions = myOptions || {};
};

Ribs.MixinBase.prototype.customInitialize = function () {
    _.bindAll(this);
};

Ribs.MixinBase.prototype.modelChanged = function () {
    this.model = this.parent.model;
};

Ribs.MixinBase.prototype.redraw = function () {
    if (this.myOptions.elementSelector) {
        this.el = $(this.parent.el).find(this.myOptions.elementSelector);
    } else {
        this.el = $(this.parent.el);
    }
};
