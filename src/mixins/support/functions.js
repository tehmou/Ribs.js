Ribs.mixinBase.resolveValue = function () {
    if (this.pivot && _.isFunction(this.pivot.getValue)) {
        this.value = this.pivot.getValue(this);
    }
};

Ribs.mixinBase.resolveJSON = function () {
    if (this.pivot && _.isFunction(this.pivot.getModelJSON)) {
        this.json = this.pivot.getModelJSON(this);
    }
};

