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

Ribs.backbone.backbonePivot = _.extend(
    Ribs.mixinBase.selfparsing, Ribs.mixinBase.composite, Ribs.mixinBase.renderChain, Ribs.mixinBase.pivot, {
    
        mixinInitialize: function () {
            Ribs.mixinBase.selfparsing.mixinInitialize.apply(this, arguments);
            Ribs.mixinBase.composite.mixinInitialize.apply(this, arguments);
            Ribs.mixinBase.renderChain.mixinInitialize.apply(this, arguments);
            Ribs.mixinBase.pivot.mixinInitialize.apply(this, arguments);

            if (typeof(this.backboneDataModel) !== "undefined") {
                this.models.data = this.backboneDataModel;
                Ribs.backbone.augmentModelWithUIAttributes(this.backboneDataModel);
                this.models.dataUI = this.backboneDataModel.ribsUI;
            }

            // Set up model change listeners for rendering only.
            _.each(this.renderingHash, _.bind(function (attributeName, modelName) {
                this.models[modelName].bind("change:" + attributeName, this.render);
            }, this));

            // Set model change listeners for invalidate+render.
            _.each(this.invalidatingHash, _.bind(function (attributeName, modelName) {
                this.invalidated = true;
                this.models[modelName].bind("change:" + attributeName, this.render);
            }, this));
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