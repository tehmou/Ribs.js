jasmine.Matchers.prototype.toHaveNumberOfchildrenTypes = function (expected) {
    if (this.actual.childrenTypes.length !== expected) {
        throw "Wrong number of mixin classes found (" + this.actual.childrenTypes.length + "/" + expected + ")";
    }
};

jasmine.Matchers.prototype.toContainOneMixinWithElementSelector = function (expected) {
    var found = false;
    _.each(this.actual.childrenTypes, function (mixin) {
        if (mixin.elementSelector === expected) {
            if (found) {
                throw "Found more than one mixins with selector '" + expected + "'";
            } else {
                found = true;
            }
        }
    });
    if (!found) {
        throw "Could not find a mixin with the selector '" + expected + "'";
    }
};

