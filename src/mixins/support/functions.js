Ribs.mixinBase.resolveValue = function () {
    this.value = this.pivot.getValue(this);
};

Ribs.mixinBase.resolveJSON = function () {
    this.json = this.pivot.getModelJSON(this);
};

