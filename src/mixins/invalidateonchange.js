Ribs.mixins.invalidateOnChange = function (classOptions) {
    classOptions = classOptions || {};

    var excludedAttributes = classOptions.excludedAttributes || null,
        includedAttributes = classOptions.includedAttributes || null,
        excludedRibsUIAttributes = classOptions.excludedRibsUIAttributes || null,
        includedRibsUIAttributes = classOptions.includedRibsUIAttributes || null,
        InvalidateOnChange = function (instanceOptions) {
            return _.extend(new Ribs.MixinBase(classOptions, instanceOptions), {
                modelChanged: function () {
                    if (this.model) {
                        this.model.unbind("change", this.change);
                        this.model.ribsUI.unbind("change", this.ribsUIChange);
                    }
                    Ribs.MixinBase.prototype.modelChanged.apply(this, arguments);
                    if (this.model) {
                        this.model.bind("change", this.change);
                        this.model.ribsUI.bind("change", this.ribsUIChange);
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
            });
            return mixin;
        };

    return InvalidateOnChange;
};

