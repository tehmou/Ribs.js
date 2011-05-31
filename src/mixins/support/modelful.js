(function () {

    Ribs.mixinBase = {};

    Ribs.mixinBase.modelBinding = {
        getMyValue: function () {
            return this.model && this.model.get(this.attributeName);
        },
        setMyValue: function (value) {
            if (this.model && this.attributeName) {
                var newValues = {};
                newValues[this.attributeName] = value;
                this.model.set(newValues);
                return true;
            }
            return false;
        },
        updateModel: function () {
            if (this.parent && this.parent.ribsUIModels) {
                var model = this.parent.ribsUIModels.get(this.modelName);
                if (this.model !== model) {
                    if (typeof(this.bindToModel) === "function") {
                        this.bindToModel(model);
                    }
                    this.model = model;
                }
            }
        }
    };
}());