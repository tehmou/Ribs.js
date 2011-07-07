/**
 * @class
 * @requires Ribs.backbone.mixins.support.modelBase
 */
Ribs.backbone.mixins.support.modelJSON = {
    getModelJSON: function (options) {
        var json,
            modelName = options.jsonModelName || options.modelName;

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
    }
};

