Ribs.mixins.invalidateOnChange = function (classOptions) {
    var InvalidateOnChangeInst = function (parent) {
            return _.extend({
                modelName: "dataUI",
                eventName: "change",
                excludedAttributes: null,
                includedAttributes: null,

                modelChanging: function () {
                    var model = this.getMyModel();
                    if (model) {
                        if (typeof(model.safeUnbind) === "function") {
                            model.safeUnbind(this.eventName, this.change);
                        } else {
                            model.unbind(this.eventName, this.change);
                        }
                    }
                },
                modelChanged: function () {
                    var model = this.getMyModel();
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

