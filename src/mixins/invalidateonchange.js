Ribs.mixins.invalidateOnChange = function (classOptions) {
    var InvalidateOnChangeInst = function (parent) {
            var model;
            return _.extend({
                modelName: "dataUI",
                eventName: "change",
                excludedAttributes: null,
                includedAttributes: null,

                bindToModel: function (value) {
                    if (model) {
                        if (typeof(model.safeUnbind) === "function") {
                            model.safeUnbind(this.eventName, this.change);
                        } else {
                            model.unbind(this.eventName, this.change);
                        }
                    }
                    model = value;
                    if (model) {
                        model.bind(this.eventName, this.change);
                    }
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
                }
            }, classOptions || {});
        };

    return InvalidateOnChangeInst;
};

