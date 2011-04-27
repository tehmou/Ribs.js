Ribs.mixins.invalidateOnChange = function (classOptions) {
    classOptions = classOptions || {};

    var excludedAttributes = classOptions.excludedAttributes || null,
        includedAttributes = classOptions.includedAttributes || null,
        excludedRibsUIAttributes = classOptions.excludedRibsUIAttributes || null,
        includedRibsUIAttributes = classOptions.includedRibsUIAttributes || null,
        InvalidateOnChange = function (parent) {
            return {
                modelChanging: function () {
                    if (this.model) {
                        this.model.unbind("change", this.change);
                    }
                    if (this.ribsUI.safeUnbind) {
                        this.ribsUI.safeUnbind("change", this.ribsUIChange);
                    }
                },
                modelChanged: function () {
                    if (this.model) {
                        this.model.bind("change", this.change);
                    }
                    this.ribsUI.bind("change", this.ribsUIChange);
                },
                change: function (ev) {
                    _.each(ev.changedAttributes(), this.checkAttribute);
                },
                checkAttribute: function (value, attrName) {
                    var excluded = excludedAttributes && excludedAttributes.indexOf(attrName) != -1,
                        included = includedAttributes && includedAttributes.indexOf(attrName) != -1;
                    if (!excluded && included && !parent.invalidated) {
                        parent.invalidated = true;
                        _.defer(parent.render);
                    }
                },
                ribsUIChange: function (ev) {
                    _.each(ev.changedAttributes(), this.checkUIAttribute);
                },
                checkUIAttribute: function (value, attrName) {
                    var excluded = excludedRibsUIAttributes && excludedRibsUIAttributes.indexOf(attrName) != -1,
                        included = includedRibsUIAttributes && includedRibsUIAttributes.indexOf(attrName) != -1;
                    if (!excluded && included && !parent.invalidated) {
                        parent.invalidated = true;
                        _.defer(parent.render);
                    }
                }
            };
        };

    return InvalidateOnChange;
};

