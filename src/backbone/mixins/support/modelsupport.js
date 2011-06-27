/**
 * @class
 */
Ribs.backbone.mixins.support.modelSupport = {
    backboneModels: null,
    createInternalModel: true,
    //inheritingMethods: ["modelRemoved", "modelAdded"],

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

        if (_.isFunction(this.modelAdded)) {
            _.each(this.models.attributes, _.bind(function (model, name) {
                this.modelAdded(name, model);
            }, this));
        }
    },

    modelChangeHandler: function () {
        var previousAttributes = this.models.previousAttributes(),
            changedAttributes = this.models.changedAttributes(),
            broadcastChange = _.bind(function (value, key) {
                if (this.models.previous(key) && _.isFunction(this.modelRemoved)) {
                    this.modelRemoved(key, this.models.previous(key));
                }
                if (this.models.get(key) && _.isFunction(this.modelAdded)) {
                    this.modelAdded(key, this.models.get(key));
                }
            }, this);

        // Backbone changedAttributes() does not include any
        // deleted ones. Check for them manually.
        for (var key in previousAttributes) {
            if (previousAttributes.hasOwnProperty(key) &&
                    !this.models.attributes.hasOwnProperty(key) &&
                    _.isFunction(this.modelRemoved)) {
                this.modelRemoved(key, this.models.previous(key));
            }
        }
        if (changedAttributes) {
            _.each(changedAttributes, broadcastChange);
        }
    },

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

