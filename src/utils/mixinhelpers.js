Ribs.mixinHelpers = {
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
    }
};