Ribs.mixins.templated = function (classOptions) {
    classOptions = classOptions || {};

    var templateFunction = classOptions.templateFunction,
        className = classOptions.className,
        Templated = function (instanceOptions) {
            return _.extend(new Ribs.MixinBase(classOptions, instanceOptions), {
                redraw: function () {
                    Ribs.MixinBase.prototype.redraw.apply(this, arguments);

                    var modelJSON = this.model ? this.model.toJSON() : {},
                        uiModelJSON = (this.model && this.model.ribsUI) ? this.model.ribsUI.toJSON() : {},
                        json = _.extend(modelJSON, uiModelJSON);

                    json.t = function (name) {
                        return this.hasOwnProperty(name) ? this[name] : "";
                    };
                    this.el.html(templateFunction(json));
                    if (className) {
                        this.el.toggleClass(className, true);
                    }
                }
            });
            return mixin;
        };

    return Templated;
};

