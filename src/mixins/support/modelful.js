Ribs.mixinBase.modelful = {
    getMyValue: function () {
        if (this.modelName) {
            if (this.attributeName) {
                return this.getValue(this.modelName, this.attributeName);
            } else {
                Ribs.throwError("attributeNameNotDefined", "modelName=" + this.modelName);
            }
        } else {
            Ribs.throwError("modelNameNotDefined");
        }
        return null;
    },
    setMyValue: function (value) {
        if (this.modelName) {
            if (this.attributeName) {
                this.setValue(this.modelName, this.attributeName, value)
                return true;
            } else {
                Ribs.throwError("attributeNameNotDefined", "modelName=" + this.modelName);
            }
        } else {
            Ribs.throwError("modelNameNotDefined");
        }
        return false;
    }
};

