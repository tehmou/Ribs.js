Ribs.mixins.templated = function (classOptions) {
    classOptions = classOptions || {};

    var templateFunction = classOptions.templateFunction,
        className = classOptions.className,
        Templated = function () {
            return {
                redraw: function () {
                    var modelJSON = this.model ? this.model.toJSON() : {},
                        uiModelJSON = this.ribsUI.toJSON(),
                        json = _.extend(modelJSON, uiModelJSON);

                    json.t = function (name) {
                        return this.hasOwnProperty(name) ? this[name] : "";
                    };
                    this.el.html(templateFunction(json));
                    if (className) {
                        this.el.toggleClass(className, true);
                    }
                }
            };
        };

    return Templated;
};

