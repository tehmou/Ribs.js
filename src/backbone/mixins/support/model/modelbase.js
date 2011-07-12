/**
 * @class
 */
Ribs.backbone.mixins.support.model.modelBase = {
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
    }
};

