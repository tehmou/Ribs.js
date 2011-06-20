Ribs.support.mixins.myModel = {
    myModelName: null,

    modelAdded: function (name, model) {
        if (name !== undefined && name === this.myModelName) {
            this.myModel = model;
            if (_.isFunction(this.myModelAdded)) {
                this.myModelAdded(model);
            }
        }
    },
    modelRemoved: function (name, model) {
        if (name !== undefined && name === this.myModelName) {
            this.myModel = null;
            if (_.isFunction(this.myModelRemoved)) {
                this.myModelRemoved(model);                
            }
        }
    }
};

