/*global $,_,console*/

 /**
  * @namespace Ribs.js 0.0.90b
  * 
  * (c) 2011 Timo Tuominen
  * Ribs.js may be freely distributed under the MIT license.
  * For all details and documentation:
  * http://tehmou.github.com/ribs.js
 **/ 




// Backbone integrations

Ribs.backbone = {};
Ribs.backbone.mixins = {};
Ribs.backbone.support = {};
Ribs.backbone.utils = {};

/*global Backbone*/

Ribs.backbone.create = function () {
    var args = Array.prototype.concat.apply([{}, Ribs.backbone.backbonePivot], arguments);
    return Ribs.utils.addingExtend.apply(this, args);
};

Ribs.mixins.backbone = Ribs.backbone.mixins = {};

Ribs.backbone.utils.NonSyncingCollection = Backbone.Collection.extend({
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
});

Ribs.backbone.utils.createUIManager = function (key, myOptions) {
    myOptions = myOptions || {};

    Ribs.backbone.uiManagers = Ribs.backbone.uiManagers || {};

    Ribs.backbone.uiManagers[key] = (function () {
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

Ribs.backbone.utils.augmentModelWithUIAttributes = function (model) {
    if (!model.hasOwnProperty("ribsUI")) {
        model.ribsUI = new Backbone.Model();
        model.ribsUI.set({ owner: model });
        model.ribsUI.bind("all", function (event) {
            var ev = "ribsUI:" + event;
            model.trigger(ev, Array.prototype.slice.call(arguments, 1));
        });
    }
};




// Support blocks

Ribs.backbone.support.functions = {};
Ribs.backbone.support.mixins = {};

Ribs.backbone.support.mixins.invalidating = {
    mixinInitialize: function () {
        var that = this;

        this.renderingHash = this.renderingHash || {};
        this.invalidatingHash = this.invalidatingHash || {};

        // Set up model change listeners for rendering only.
        _.each(this.renderingHash, function (attributeName, modelName) {
            that.models[modelName].bind("change:" + attributeName, this.render);
        });

        // Set model change listeners for invalidate+render.
        _.each(this.invalidatingHash, function (attributeName, modelName) {
            that.models[modelName].bind("change:" + attributeName, function () {
                that.invalidated = true;
                that.render();
            });
        });
    }
};

Ribs.backbone.support.mixins.modelSupport = {
    backboneModels: null,
    createInternalModel: true,
    inheritingMethods: ["modelRemoved", "modelAdded"],

    mixinInitialize: function () {
        var backboneModels = this.backboneModels || {};

        if (this.createInternalModel) {
            backboneModels = _.extend({
                internal: new Backbone.Model()
            }, backboneModels);
        }

        if (this.models) {
            this.models.set(backboneModels);
        } else {
            this.models = new Backbone.Model(backboneModels);
        }

        this.models.bind("change", _.bind(function () { this.modelChangeHandler(); }, this));

        _.each(this.models.attributes, _.bind(function (model, name) {
            this.modelAdded(name, model);
        }, this));
    },

    modelChangeHandler: function () {
        var previousAttributes = this.models.previousAttributes(),
            changedAttributes = this.models.changedAttributes(),
            broadcastChange = _.bind(function (value, key) {
                if (this.models.previous(key)) {
                    this.modelRemoved(key, this.models.previous(key));
                }
                if (this.models.get(key)) {
                    this.modelAdded(key, this.models.get(key));
                }
            }, this);

        // Backbone changedAttributes() does not include any
        // deleted ones. Check for them manually.
        for (var key in previousAttributes) {
            if (previousAttributes.hasOwnProperty(key) && !this.models.attributes.hasOwnProperty(key)) {
                this.modelRemoved(key, this.models.previous(key));
            }
        }
        if (changedAttributes) {
            _.each(changedAttributes, broadcastChange);
        }
    },

    modelRemoved: function (name, oldModel) { },

    modelAdded: function (name, newModel) { },

    getModelJSON: function (options) {
        var json,
            modelName = options.jsonModelName;

        if (!modelName || !this.models) {
            return;
        }

        if (_.isArray(modelName)) {
            json = {};
            for (var i = 0; i < modelName.length; i++) {
                _.extend(json, this.getModelJSON({ jsonModelName: modelName[i] }));
            }
        } else {
            if (!this.models.attributes.hasOwnProperty(modelName)) {
                Ribs.throwError("modelNotFound", "" + modelName);
                return;
            }
            json = this.models.get(modelName).toJSON();
        }
        return json;
    },

    getValue: function (options) {
        var modelName = options.valueModelName,
            attributeName = options.valueAttributeName;

        if (!modelName || !attributeName || !this.models) {
            return;
        }

        if (!this.models.attributes.hasOwnProperty(modelName)) {
            Ribs.throwError("modelNotFound", "" + modelName);
            return;
        }
        if (!this.models.get(modelName).attributes.hasOwnProperty(attributeName)) {
            Ribs.throwError("attributeNotFound", "model=" + modelName + ", attribute=" + attributeName);
            return;
        }
        return this.models.get(modelName).get(attributeName);
    },

    setValue: function (options) {
        var modelName = options.valueModelName,
            attributeName = options.valueAttributeName,
            value = options.value,
            newValues;

        if (!modelName || !attributeName) {
            return;
        }

        if (!this.models.attributes.hasOwnProperty(modelName)) {
            Ribs.throwError("modelNotFound", modelName);
            return;
        }
        newValues = {};
        newValues[attributeName] = value;
        this.models.get(modelName).set(newValues);
    }
};

Ribs.backbone.support.mixins.pivot = Ribs.utils.addingExtend({},
    Ribs.mixins.plainPivot,
    Ribs.backbone.support.modelSupport,
    Ribs.backbone.support.invalidating,
    {
        mixinInitialize: function () {
            this.initialized = true;
        }
    }
);




// Mixins

Ribs.mixins.simpleList = Ribs.utils.addingExtend({},
    Ribs.support.mixins.myModel,
    {
        itemRenderer: null,

        redraw: function () {
            $(this.el).html("");
            _.each(this._listViews, _.bind(function (view) {
                if (_.isFunction(view.redraw)) {
                    view.redraw();
                }
                $(this.el).append(view.el);
            }, this));
        },
        refresh: function () {
            _.each(this._listViews, _.bind(function (view) {
                if (_.isFunction(view.refresh)) {
                    view.refresh();
                }
            }, this));
        },
        myModelAdded: function (model) {
            model.bind("add", this.listAdd);
            model.bind("remove", this.listRemove);
            model.bind("refresh", this.listRefresh);
            this.listRefresh();
        },
        myModelRemoved: function (model) {
            if (this._listViews) {
                _.each(this._listViews, function (view) {
                    if (_.isFunction(view.dispose)) {
                        view.dispose();
                    }
                });
                this._listViews = {};
            }
            model.unbind("add", this.listAdd);
            model.unbind("remove", this.listRemove);
            model.unbind("refresh", this.listRefresh);
        },
        listAdd: function (item) {
            if (!this._listViews.hasOwnProperty(item.cid)) {
                var itemView = _.extend({}, this.itemRenderer, {
                    backboneModels: { data: item },
                    jsonModelName: "data"
                });
                itemView.mixinInitialize();
                this._listViews[item.cid] = itemView;
                this.pivot.requestInvalidate();
            }
        },
        listRemove: function (item) {
            if(this._listViews.hasOwnProperty(item.cid)) {
                $(this._listViews[item.cid].el).remove();
                delete this._listViews[item.cid];
            }
        },
        listRefresh: function () {
            this._listViews = {};
            if (this.myModel && _.isFunction(this.myModel.each)) {
                this.myModel.each(this.listAdd);
            }
            this.pivot.requestInvalidate();
        }
    }
);

