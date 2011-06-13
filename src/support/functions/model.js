Ribs.support.functions.resolveValue = function () {
    if (this.pivot && _.isFunction(this.pivot.getValue)) {
        this.value = this.pivot.getValue(this);
    }
};

Ribs.support.functions.resolveJSON = function () {
    if (this.pivot && _.isFunction(this.pivot.getModelJSON)) {
        this.json = this.pivot.getModelJSON(this);
    }
};

Ribs.support.functions.myModelAddedInvoker = function (name, model) {
    if (name === this.myModelName && _.isFunction(this.myModelAdded)) {
        this.myModelAdded(name, model);
    }
};

Ribs.support.functions.myModelRemovedInvoker = function (name, model) {
    if (name === this.myModelName && _.isFunction(this.myModelRemoved)) {
        this.myModelRemoved(name, model);
    }
};

