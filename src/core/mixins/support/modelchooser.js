/**
 * @class
 * @desc Observes a model with the given name and
 * calls myModelAdded and myModelRemoved whenever
 * applicable.
 */
Ribs.mixins.support.modelChooser = {
    /**
     * @field
     * @desc Name of the model to use.
     * @default "data"
     */
    modelName: "data",

    /**
     * @method
     * @param name Name Of the model that was added.
     * @param model Model that was added.
     */
    modelAdded: function (name, model) {
        if (name && name === this.modelName) {
            this.myModel = model;
            if (_.isFunction(this.myModelAdded)) {
                this.myModelAdded(model);
            }
        }
    },

    /**
     * @method
     * @param name Name Of the model that was removed.
     * @param model Model that was removed.
     */
    modelRemoved: function (name, model) {
        if (name !== undefined && name === this.modelName) {
            this.myModel = null;
            if (_.isFunction(this.myModelRemoved)) {
                this.myModelRemoved(model);
            }
        }
    }
};
