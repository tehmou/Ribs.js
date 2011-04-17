(function(){
    var Ribs;

    Ribs = this.Ribs = {};

    Ribs.VERSION = '0.0.1';

    Ribs.mixins = {};

    Ribs.augmentModelWithUIAttributes = function (model) {
        if (!model.hasOwnProperty("ribsUI")) {
            model.ribsUI = new Backbone.Model();
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
                model.trigger("ribsUI:" + event, Array.prototype.slice.call(arguments, 1));
            });
        }
    };

    Ribs.createMixed = function (myOptions) {
        myOptions = myOptions || {};

        var requireModel = myOptions.hasOwnProperty("requireModel") ? myOptions.requireModel : true,
            mixinClasses = myOptions.mixinClasses,
            Buildee = Ribs.ManagedView.extend(),
            delegateOneToMixins = function (methodName) {
                Buildee.prototype[methodName] = function () {
                    var doIt = function () {
                        Ribs.ManagedView.prototype[methodName].apply(this, arguments);
                        _.each(this.mixins, _.bind(function (mixin) {
                            mixin.entryPoints[methodName] && mixin.entryPoints[methodName].apply(mixin, arguments);
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
            this.mixins = [];
            _.each(mixinClasses, _.bind(function (Mixin) {
                var mixin = new Mixin(this.options);
                mixin.entryPoints.mixinInitialize.apply(mixin, [this]);
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

Ribs.mixins.hoverable = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        HoverableClosure = function () {
            var parent,
                that = {
                    entryPoints: {
                        mixinInitialize: function (value) {
                            parent = value;
                        },
                        modelChanged: function () {
                            parent.model && parent.model.ribsUI.set({ hovering: false });
                        },
                        redraw: function () {
                            that.el = elementSelector ? $(parent.el).find(elementSelector) : $(parent.el);
                        },
                        refresh: function () {
                            that.el
                                    .mouseenter(that.mouseOver)
                                    .mouseleave(that.mouseOut)
                                    .toggleClass("hovering", parent.model.ribsUI.get("hovering"));
                        }
                    },

                    mouseOver: function () {
                        parent.model.ribsUI.set({ hovering: true });
                    },
                    mouseOut: function () {
                        parent.model.ribsUI.set({ hovering: false });
                    }
                };
            return that;
        };

    return HoverableClosure;
};

Ribs.mixins.selectable = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        SelectableClosure = function () {
            var parent,
                that = {
                    events: {
                        "click": "elementClicked"
                    },
                    entryPoints: {
                        mixinInitialize: function (value) {
                            parent = value;
                        },
                        modelChanged: function () {
                            parent.model && parent.model.ribsUI.set({ selected: false });
                        },
                        redraw: function () {
                            that.el = elementSelector ? $(parent.el).find(elementSelector) : $(parent.el);
                        },
                        refresh: function () {
                            that.el.toggleClass("selected", parent.model.ribsUI.get("selected"));
                        }
                    },
                    
                    elementClicked: function () {
                        parent.model.ribsUI.set({ selected: !parent.model.ribsUI.get("selected") });
                    }
                };

            return that;
        };

    return SelectableClosure;
};

Ribs.mixins.simpleList = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        listAttributeName = myOptions.listAttributeName,
        ItemRenderer = myOptions.ItemRenderer,
        SimpleListClosure = function () {
            var parent, listModel, listViews,
                that = {
                    entryPoints: {
                        mixinInitialize: function (value) {
                            parent = value;
                        },
                        modelChanged: function () {
                            _.each(listViews, function (view) {
                                view.dispose();
                            });
                            listViews = {};
                            if (listModel) {
                                listModel.unbind("add", that.addOne);
                                listModel.unbind("remove", that.removeOne);
                                listModel.unbind("refresh", that.addAll);
                            }
                            if (parent.model) {
                                listModel = listAttributeName ? parent.model.get(listAttributeName) : parent.model;
                                listModel.bind("add", that.addOne);
                                listModel.bind("remove", that.removeOne);
                                listModel.bind("refresh", that.addAll);
                                that.addAll();
                            } else {
                                parent.model = null;
                            }
                        },
                        redraw: function () {
                            that.el = elementSelector ? $(parent.el).find(elementSelector) : $(parent.el);
                            that.el.children().detach();
                            _.each(listViews, function (view) {
                                that.el.append(view.el);
                            });
                        },
                        render: function () {
                            _.each(listViews, function (view) {
                                view.render();
                            });
                        }
                    },
                    addOne: function (item) {
                        if (!listViews.hasOwnProperty(item.cid)) {
                            var listView = new ItemRenderer({ model: item });
                            listViews[item.cid] = listView;
                            parent.invalidated = true;
                        }
                    },
                    addAll: function () {
                        listModel.each(that.addOne);
                    },
                    removeOne: function (item) {
                        delete listViews[item.cid];
                        $(item.el).remove();
                    }
                };

            return that;
        };

    return SimpleListClosure;
};

Ribs.mixins.templated = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        templateFunction = myOptions.templateFunction,
        className = myOptions.className,
        TemplatedClosure = function () {
            var parent,
                that = {
                    entryPoints: {
                        mixinInitialize: function (value) {
                            parent = value;
                        },
                        redraw: function () {
                            that.el = elementSelector ? $(parent.el).find(elementSelector) : $(parent.el);

                            var json = parent.model ? (parent.model.toJSON ? parent.model.toJSON() : parent.model) : {};
                            json.t = function (name) {
                                return this.hasOwnProperty(name) ? this[name] : "";
                            };
                            that.el.html(templateFunction(json));
                            className && that.el.toggleClass(className, true);
                        }
                    }
                };
            
            return that;
        };

    return TemplatedClosure;
};

Ribs.mixins.toggleableElement = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        ToggleableElementClosure = function () {
            var parent,
                that = {
                    openChanged: function () {
                        parent && (parent.invalidated = true);
                    },

                    entryPoints: {
                        mixinInitialize: function (value) {
                            parent = value;
                        },
                        modelChanged: function () {
                            parent.model && parent.model.ribsUI.bind("change:open", that.openChanged);
                        },
                        redraw: function () {
                            that.el = elementSelector ? $(parent.el).find(elementSelector) : $(parent.el);
                            that.el.toggle(parent.model.ribsUI.get("open"));
                        }
                    }
                };


            return that;
        };

    return ToggleableElementClosure;
};

Ribs.mixins.toggleButton = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        usePlusMinus = myOptions.usePlusMinus,
        ToggleButtonClosure = function () {
            var parent,
                that = {
                    events: {
                        "click": "toggle"
                    },
                    entryPoints: {
                        mixinInitialize: function (value) {
                            parent = value;
                        },
                        modelChanged: function () {
                            parent.model && parent.model.ribsUI.set({ open: false });
                        },
                        redraw: function () {
                            that.el = elementSelector ? $(parent.el).find(elementSelector) : $(parent.el);
                        },
                        refresh: function () {
                            if (usePlusMinus) {
                                that.el.text(parent.model.ribsUI.get("open") ? "-" : "+");
                            }
                        }
                    },
                    toggle: function () {
                        parent.model.ribsUI.set({ open: !parent.model.ribsUI.get("open") });
                    }
                };

            return that;
        };

    return ToggleButtonClosure;
};

