(function(){
    var Ribs;

    Ribs = this.Ribs = {};

    Ribs.VERSION = '0.0.1';

    Ribs.mixins = {};

    Ribs.augmentModelWithUIAttributes = function (model) {
        if (!model.hasOwnProperty("ribsUI")) {
            model.ribsUI = new Backbone.Model();
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
                            mixin[methodName] && mixin[methodName].apply(this, arguments);
                        }, this));
                    }

                    if (this.entryPoint) {
                        this.entryPoint.apply(this, [doIt].concat(arguments));
                    } else {
                        doIt.apply(this, arguments);
                    }
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
                this.mixins.push(new Mixin(this.options));
            }, this));
            Ribs.ManagedView.prototype.initialize.apply(this, arguments);
        };

        delegateToMixins(["customInitialize", "modelChanged", "render", "redraw", "refresh", "hide", "dispose"]);

        return Buildee;
    };

})();

Ribs.ManagedView = Backbone.View.extend({
    invalidated: true,
    refreshOnlyIfVisible: false,

    initialize: function () {
        _.bindAll(this, "customInitialize", "render", "redraw", "refresh", "hide", "dispose");
        Backbone.View.prototype.initialize.apply(this, arguments);
        this.model && this.bindToModel(this.model);
        this.customInitialize();
        this.render();
    },
    customInitialize: function () { },
    bindToModel: function (model) {
        this.model && this.model.ribsUI && this.model.ribsUI.unbind("all", this.render);
        this.model = model;
        if (this.model) {
            Ribs.augmentModelWithUIAttributes(this.model);
            this.model.ribsUI.bind("all", this.render);
        }
        this.modelChanged();
        this.render();
    },
    modelChanged: function () { },
    render: function () {
        if (this.invalidated) {
            this.redraw();
        }
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
                    // TODO: See below.
                    //viewModel.set({ nowHovering: null });
                } else if (item !== viewModel.get("nowHovering") && item.get("hovering")) {
                    var lastHovering = viewModel.get("nowHovering");
                    viewModel.set({ nowHovering: item });
                    lastHovering && lastHovering.set({ hovering: false });
                }
            },
            selectedChanged = function (event) {
                var item = event[0];
                if (item === viewModel.get("nowSelected") && !item.get("selected")) {
                    // TODO: Throws exception when selected item is unselected.
                    //viewModel.set({ nowSelected: null });
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

Ribs.mixins.Hoverable = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        InnerClosure = function () {
            var that,
                mouseOver = function () {
                    that.model.ribsUI.set({ hovering: true });
                },
                mouseOut = function () {
                    that.model.ribsUI.set({ hovering: false });
                };

            return {
                customInitialize: function () {
                    that = this;
                },
                modelChanged: function () {
                    this.model && this.model.ribsUI.set({ hovering: false });
                },
                refresh: function () {
                    var $elem = elementSelector ? $(this.el).find(elementSelector) : $(this.el);
                    $elem
                            .unbind("mouseover", mouseOver)
                            .unbind("mouseout", mouseOut)
                            .bind("mouseover", mouseOver)
                            .bind("mouseout", mouseOut)
                            .toggleClass("hovering", this.model.ribsUI.get("hovering"));
                }
            };
        };

    return InnerClosure;
};

Ribs.mixins.Selectable = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        InnerClosure = function () {
            var that, elementClicked = function () {
                that.model.ribsUI.set({ selected: !that.model.ribsUI.get("selected") });
            };

            return {
                customInitialize: function () {
                    that = this;
                },
                modelChanged: function () {
                    this.model.ribsUI.set({ selected: false });
                },
                refresh: function () {
                    var $elem = elementSelector ? $(this.el).find(elementSelector) : $(this.el);
                    $elem
                            .unbind("click", elementClicked)
                            .bind("click", elementClicked)
                            .toggleClass("selected", this.model.ribsUI.get("selected"));
                }
            };
        };

    return InnerClosure;
};

Ribs.mixins.SimpleList = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        listAttributeName = myOptions.listAttributeName,
        ItemRenderer = myOptions.ItemRenderer,
        initializeOnlyWhenOpen = myOptions.initiazeOnlyWhenOpen || false,
        InnerClosure = function () {
            var that, listModel, listViews,
                addOne = function (item) {
                    if (!listViews.hasOwnProperty(item.cid)) {
                        var listView = new ItemRenderer({ model: item });
                        listViews[item.cid] = listView;
                        invalidated = true;
                    }
                },
                addAll = function () {
                    listModel.each(addOne);
                },
                removeOne = function (item) {
                    delete listViews[item.cid];
                    $(item.el).remove();
                };

            return {
                customInitialize: function () {
                    that = this;
                },
                modelChanged: function () {
                    _.each(listViews, function (view) {
                        view.dispose();
                    });
                    listViews = {};
                    if (listModel) {
                        listModel.unbind("add", addOne);
                        listModel.unbind("remove", removeOne);
                        listModel.unbind("refresh", addAll);
                    }
                    listModel = listAttributeName ? this.model.get(listAttributeName) : this.model;
                    listModel.bind("add", addOne);
                    listModel.bind("remove", removeOne);
                    listModel.bind("refresh", addAll);
                    addAll();
                },
                redraw: function () {
                    var $elem = elementSelector ? $(this.el).find(elementSelector) : $(this.el);
                    $elem.children().detach();
                    _.each(listViews, function (view) {
                        $elem.append(view.el);
                    });
                },
                render: function () {
                    _.each(listViews, function (view) {
                        view.render();
                    });
                }
            };
        };

    return InnerClosure;
};

Ribs.mixins.Templated = function (myOptions) {
    myOptions = myOptions || {};

    var tagClass = myOptions.tagClass,
        templateFunction = myOptions.templateFunction,
        InnerClosure = function () {
            return {
                redraw: function () {
                    var json = this.model ? this.model.toJSON() : {};
                    json.t = function (name) {
                        return this.hasOwnProperty(name) ? this[name] : "";
                    };
                    $(this.el).html(templateFunction(json));
                    tagClass && $(this.el).toggleClass(tagClass, true);
                }
            };
        };

    return InnerClosure;
};

Ribs.mixins.Toggleable = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        usePlusMinus = myOptions.usePlusMinus,
        InnerClosure = function () {
            var that,
                toggle = function () {
                    that.model.ribsUI.set({ open: !that.model.ribsUI.get("open") });
                };

            return {
                customInitialize: function () {
                    that = this;
                },
                modelChanged: function () {
                    this.model.ribsUI.set({ open: false });
                },
                refresh: function () {
                    var $elem = elementSelector ? $(this.el).find(elementSelector) : $(this.el);
                    $elem
                            .unbind("click", toggle)
                            .bind("click", toggle);
                    if (usePlusMinus) {
                        $elem.text(this.model.ribsUI.get("open") ? "-" : "+");
                    }
                }
            };
        };

    return InnerClosure;
};

Ribs.mixins.ToggleableElement = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        InnerClosure = function () {
            var that,
                openChanged = function () {
                    that.invalidated = true;
                };

            return {
                customInitialize: function () {
                    that = this;
                },
                modelChanged: function () {
                    this.model.bind("ribs:ui:open", openChanged);
                },
                redraw: function () {
                    var $elem = elementSelector ? $(this.el).find(elementSelector) : $(this.el);
                    $elem.toggle(this.model.ribsUI.get("open"));
                }
            };
        };

    return InnerClosure;
};

