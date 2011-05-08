Ribs.mixins.invalidateOnChange = function (classOptions) {
    classOptions = classOptions || {};

    var excludedAttributes = classOptions.excludedAttributes || null,
        includedAttributes = classOptions.includedAttributes || null,
        excludedRibsUIAttributes = classOptions.excludedRibsUIAttributes || null,
        includedRibsUIAttributes = classOptions.includedRibsUIAttributes || null,

        InvalidateOnChangeInst = function (parent) {
            return {
                attributeName: classOptions.attributeName,
                uiAttributeName: classOptions.uiAttributeName,
                elementSelector: classOptions.elementSelector,
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
                    var excluded = excludedAttributes && _.indexOf(excludedAttributes, attrName) !== -1,
                        included = includedAttributes && _.indexOf(includedAttributes, attrName) !== -1;
                    if (!excluded && included && !parent.invalidated) {
                        parent.invalidated = true;
                        _.defer(parent.render);
                    }
                },
                ribsUIChange: function (ev) {
                    _.each(ev.changedAttributes(), this.checkUIAttribute);
                },
                checkUIAttribute: function (value, attrName) {
                    var excluded = excludedRibsUIAttributes && _.indexOf(excludedRibsUIAttributes, attrName) !== -1,
                        included = includedRibsUIAttributes && _.indexOf(includedRibsUIAttributes, attrName) !== -1;
                    if (!excluded && included && !parent.invalidated) {
                        parent.invalidated = true;
                        _.defer(parent.render);
                    }
                }
            };
        };

    return InvalidateOnChangeInst;
};

