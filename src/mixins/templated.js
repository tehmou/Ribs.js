Ribs.mixins.templated = function (classOptions) {
    classOptions = classOptions || {};

    var templateSelector = classOptions.templateSelector,
        templateFunction = templateSelector ? _.template($(templateSelector).html()) : classOptions.templateFunction,
        className = classOptions.className,

        TemplatedInst = function () {
            return {
                redraw: function () {
                    var modelJSON = this.dataModel ? this.dataModel.toJSON() : {},
                        uiModelJSON = this.uiModel.toJSON(),
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

    Ribs.readMixinOptions(TemplatedInst, classOptions);
    return TemplatedInst;
};

