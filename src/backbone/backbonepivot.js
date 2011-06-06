Ribs.backbone.augmentModelWithUIAttributes = function (model) {
    if (!model.hasOwnProperty("ribsUI")) {
        model.ribsUI = new Backbone.Model();
        model.ribsUI.set({ owner: model });
        model.ribsUI.bind("all", function (event) {
            var ev = "ribsUI:" + event;
            model.trigger(ev, Array.prototype.slice.call(arguments, 1));
        });
    }
};

Ribs.backbone.invalidating = {
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

Ribs.backbone.modelSupport = {
    backboneModels: null,

    mixinInitialize: function () {
        this.inheritingMethods = this.inheritingMethods.concat(["modelRemoved", "modelAdded"]);

        var backboneModels = _.extend({
            internal: new Backbone.Model()
        }, this.backboneModels || {});

        if (this.models) {
            this.models.set(backboneModels);
        } else {
            this.models = new Backbone.Model(backboneModels);
        }

        this.models.bind("change", this.modelChangeHandler);

        if (typeof(this.models.get("data")) !== "undefined") {
            Ribs.backbone.augmentModelWithUIAttributes(this.models.get("data"));
            this.models.dataUI = this.models.get("data").ribsUI;
        }
    },

    modelChangeHandler: function () {
        var changedAttributes = this.models.changedAttributes(),
            broadcastChange = function (value, key) {
                if (this.models.previous(key)) {
                    this.modelRemoved(key, this.models.previous(key));
                }
                if (this.models.get(key)) {
                    this.modelAdded(key, this.models.get(key));                    
                }
            };

        if (changedAttributes) {
            _.each(changedAttributes, broadcastChange);
        }
    },
    modelRemoved: function (name, oldModel) { },
    modelAdded: function (name, newModel) { }
};

Ribs.backbone.backbonePivot = _.extend(
    Ribs.mixinBase.selfParsing,
    Ribs.mixinBase.composite,
    Ribs.mixinBase.renderChain,
    Ribs.mixinBase.pivotEl,
    Ribs.backbone.modelSupport,
    Ribs.backbone.invalidating,
    {
        mixinInitialize: function () {
            Ribs.mixinBase.renderChain.mixinInitialize.apply(this, arguments);
            Ribs.mixinBase.pivotEl.mixinInitialize.apply(this, arguments);
            Ribs.mixinBase.composite.mixinInitialize.apply(this, arguments);
            Ribs.backbone.modelSupport.mixinInitialize.apply(this, arguments);
            Ribs.backbone.invalidating.mixinInitialize.apply(this, arguments);
            Ribs.mixinBase.selfParsing.mixinInitialize.apply(this, arguments);
            this.initialized = true;
        },

        getValue: function (options) {
            var modelName = options.modelName,
                attributeName = options.attributeName;

            if (!this.models.hasOwnProperty(modelName)) {
                Ribs.throwError("modelNotFound", modelName);
                return;
            }
            if (!this.models[modelName].attributes.hasOwnProperty(attributeName)) {
                Ribs.throwError("attributeNotFound", "model=" + modelName + ", attribute=" + attributeName);
                return;
            }
            return this.models[modelName].get(attributeName);
        },

        setValue: function (options) {
            var modelName = options.modelName,
                attributeName = options.attributeName,
                value = options.value,
                newValues;

            if (!this.models.hasOwnProperty(modelName)) {
                Ribs.throwError("modelNotFound", modelName);
                return;
            }
            
            newValues = {};
            newValues[attributeName] = value;
            this.models[modelName].set(newValues);
        }
    }
);

