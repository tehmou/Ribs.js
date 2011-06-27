/**
 * @class
 */
Ribs.backbone.mixins.support.invalidating = {
    renderingHash: [],
    invalidatingHash: [],
    
    mixinInitialize: function () {
        var that = this;

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

