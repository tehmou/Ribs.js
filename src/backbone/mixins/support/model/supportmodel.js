/**
 * @class
 * @requires Ribs.mixins.support.modelChooser
 */
Ribs.backbone.mixins.support.supportModel = {
    supportModelName: "support",
    useSupportModel: true,

    myModelAdded: function (model) {
        if (this.useSupportModel && this.supportModelName && model.hasOwnProperty(this.supportModelName)) {
            var values = {};
            values[this.supportModelName] = model.supportModel;
            this.models.set(values);
        }
    },

    myModelRemoved: function (model) {
        if (this.useSupportModel && this.supportModelName) {
            this.models.unset(this.supportModelName);
        }
    }
};