/**
 * @class
 */
Ribs.utils.resolveValue = function () {
    if (this.pivot && _.isFunction(this.pivot.getValue)) {
        this.value = this.pivot.getValue(this);
    }
};

/**
 * @class
 */
Ribs.utils.resolveJSON = function () {
    if (this.pivot && _.isFunction(this.pivot.getModelJSON)) {
        this.json = this.pivot.getModelJSON(this);
    }
};

