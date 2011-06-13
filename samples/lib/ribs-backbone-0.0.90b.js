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

/*global Backbone*/

Ribs.backbone = {};

Ribs.backbone.modelSupport = {
    backboneModels: null,
    createInternalModel: true,

    mixinInitialize: function () {
        this.inheritingMethods = (this.inheritingMethods || []).concat(["modelRemoved", "modelAdded"]);
        var backboneModels = this.backboneModels || {};

        if (this.createInternalModel) {
            _.extend(backboneModels, {
                internal: new Backbone.Model()
            });
        }

        if (this.models) {
            this.models.set(backboneModels);
        } else {
            this.models = new Backbone.Model(backboneModels);
        }

        this.models.bind("change", _.bind(function () { this.modelChangeHandler(); }, this));

        if (typeof(this.models.get("data")) !== "undefined") {
            Ribs.backbone.augmentModelWithUIAttributes(this.models.get("data"));
            this.models.dataUI = this.models.get("data").ribsUI;
        }
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

        if (!modelName) {
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

        if (!modelName || !attributeName) {
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

Ribs.backbone.backbonePivot = Ribs.addingExtend({},
    Ribs.mixins.plainPivot,
    Ribs.backbone.modelSupport,
    Ribs.backbone.invalidating,
    {
        mixinInitialize: function () {
            this.initialized = true;
        }
    }
);

