Ribs.mixins.invalidateOnChange = function (classOptions) {
    classOptions = classOptions || {};

    var excludedAttributes = classOptions.excludedAttributes || null,
        includedAttributes = classOptions.includedAttributes || null,
        excludedRibsUIAttributes = classOptions.excludedRibsUIAttributes || null,
        includedRibsUIAttributes = classOptions.includedRibsUIAttributes || null,
        InvalidateOnChange = function () {
            return {
                modelChanging: function (newModel) {
                    if (this.model) {
                        this.model.unbind("change", this.change);
                        this.model.ribsUI.unbind("change", this.ribsUIChange);
                    }
                    if (newModel) {
                        newModel.bind("change", this.change);
                        newModel.ribsUI.bind("change", this.ribsUIChange);
                    }
                },
                checkAttribute: function (value, attrName) {
                    var excluded = excludedAttributes && excludedAttributes.indexOf(attrName) != -1,
                        included = includedAttributes && includedAttributes.indexOf(attrName) != -1;
                    if (!excluded && included && !this.parent.invalidated) {
                        this.parent.invalidated = true;
                        _.defer(this.parent.render);
                    }
                },
                change: function (ev) {
                    _.each(ev.changedAttributes(), this.checkAttribute);
                },
                checkUIAttribute: function (value, attrName) {
                    var excluded = excludedRibsUIAttributes && excludedRibsUIAttributes.indexOf(attrName) != -1,
                        included = includedRibsUIAttributes && includedRibsUIAttributes.indexOf(attrName) != -1;
                    if (!excluded && included && !this.parent.invalidated) {
                        this.parent.invalidated = true;
                        _.defer(this.parent.render);
                    }
                },
                ribsUIChange: function (ev) {
                    _.each(ev.changedAttributes(), this.checkUIAttribute);
                }
            };
        };

    return InvalidateOnChange;
};

