Ribs.mixins.invalidateOnChange = function (myOptions) {
    myOptions = myOptions || {};

    var excludedAttributes = myOptions.excludedAttributes || null,
        includedAttributes = myOptions.includedAttributes || null,
        excludedRibsUIAttributes = myOptions.excludedRibsUIAttributes || null,
        includedRibsUIAttributes = myOptions.includedRibsUIAttributes || null,
        InvalidateOnChange = function () {
            return _.extend(new Ribs.mixins.MixinBase(myOptions),
            {
                modelChanged: function () {
                    if (this.model) {
                        this.model.unbind("change", this.change);
                        this.model.ribsUI.unbind("change", this.ribsUIChange);
                    }
                    Ribs.mixins.MixinBase.prototype.modelChanged.apply(this, arguments);
                    if (this.model) {
                        this.model.bind("change", this.change);
                        this.model.ribsUI.bind("change", this.ribsUIChange);
                    }
                },

                change: function (ev) {
                    var excluded = excludedAttributes && excludedAttributes.indexOf(ev) != -1,
                        included = includedAttributes && includedAttributes.indexOf(ev) != -1;
                    if (!excluded && included) {
                        this.parent.invalidated = true;
                        _.defer(this.parent.render());
                    }
                },
                ribsUIChange: function (ev) {
                    var excluded = excludedRibsUIAttributes && excludedRibsUIAttributes.indexOf(ev) != -1,
                        included = includedRibsUIAttributes && includedRibsUIAttributes.indexOf(ev) != -1;
                    if (!excluded && included) {
                        this.parent.invalidated = true;
                        _.defer(this.parent.render());
                    }
                }
            });
            return mixin;
        };

    return InvalidateOnChange;
};

