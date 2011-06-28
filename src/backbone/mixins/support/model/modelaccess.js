/**
 * @class
 * @requires Ribs.backbone.mixins.support.modelBase
 */
Ribs.backbone.mixins.support.modelAccess = {

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

