Ribs.mixinBase.modelful = {
    getMyModelJSON: function () {
        if (this.modelName) {
            return this.getModelJSON({
                modelName: this.modelName
            });
        } else {
            Ribs.throwError("modelNameNotDefined");
        }
    },
    getMyValue: function () {
        if (this.modelName) {
            if (this.attributeName) {
                return this.getValue({
                    modelName: this.modelName,
                    attributeName: this.attributeName
                });
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
                this.setValue({
                    modelName: this.modelName,
                    attributeName: this.attributeName,
                    value: value
                });
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

