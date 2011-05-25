/**
 * @method
 * @desc Observes attributes of the data and UI models and
 * sets the invalidated flag of the parent View if they change.
 *
 * @param classOptions
 * @param classOptions.excludedAttributes Array of attribute names
 * which should not be observed in the original data model (even if
 * defined in includedAttributes).
 * @param classOptions.includedAttributes Array of attribute names
 * which should be observed in the original data model.
 * @param classOptions.excludedRibsUIAttributes Same as excludedAttributes,
 * except for observing changes in the UI model that is attached
 * to the original data model.
 * @param classOptions.includedRibsUIAttributes Same as excludedAttributes,
 * except for observing changes in the UI model that is attached
 * to the original data model.
 */
Ribs.mixins.invalidateOnChange = function (classOptions) {
    var InvalidateOnChangeInst = function (parent) {
            return _.extend({
                excludedAttributes: null,
                includedAttributes: null,
                excludedRibsUIAttributes: null,
                includedRibsUIAttributes: null,

                modelChanging: function () {
                    if (this.dataModel) {
                        this.dataModel.unbind("change", this.change);
                    }
                    if (this.uiModel.safeUnbind) {
                        this.uiModel.safeUnbind("change", this.ribsUIChange);
                    }
                },
                modelChanged: function () {
                    if (this.dataModel) {
                        this.dataModel.bind("change", this.change);
                    }
                    this.uiModel.bind("change", this.ribsUIChange);
                },
                change: function (ev) {
                    _.each(ev.changedAttributes(), this.checkAttribute);
                },
                checkAttribute: function (value, attrName) {
                    var excluded = this.excludedAttributes && _.indexOf(this.excludedAttributes, attrName) !== -1,
                        included = this.includedAttributes && _.indexOf(this.includedAttributes, attrName) !== -1;
                    if (!excluded && included && !parent.invalidated) {
                        parent.invalidated = true;
                        _.defer(parent.render);
                    }
                },
                ribsUIChange: function (ev) {
                    _.each(ev.changedAttributes(), this.checkUIAttribute);
                },
                checkUIAttribute: function (value, attrName) {
                    var excluded = this.excludedRibsUIAttributes && _.indexOf(this.excludedRibsUIAttributes, attrName) !== -1,
                        included = this.includedRibsUIAttributes && _.indexOf(this.includedRibsUIAttributes, attrName) !== -1;
                    if (!excluded && included && !parent.invalidated) {
                        parent.invalidated = true;
                        _.defer(parent.render);
                    }
                }
            }, classOptions || {});
        };

    return InvalidateOnChangeInst;
};

