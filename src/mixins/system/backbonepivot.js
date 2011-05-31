Ribs.mixins.backbonePivot = _.extend(
    Ribs.mixinBase.parsing, Ribs.mixinBase.composite, Ribs.mixinBase.renderChain, Ribs.mixinBase.pivot, {
        mixinInitialize: function () {
            Ribs.mixinBase.parsing.mixinInitialize.apply(this, arguments);
            Ribs.mixinBase.composite.mixinInitialize.apply(this, arguments);
            Ribs.mixinBase.renderChain.mixinInitialize.apply(this, arguments);
            Ribs.mixinBase.pivot.mixinInitialize.apply(this, arguments);

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