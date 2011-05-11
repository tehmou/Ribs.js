Ribs.mixins.templated = function (classOptions) {
    classOptions = classOptions || {};
    var defaultTemplateFunction = classOptions.templateSelector && _.template($(classOptions.templateSelector)),
        TemplatedInst = function () {
            return _.extend({
                templateSelector: null,
                templateFunction: defaultTemplateFunction,
                className: null,

                redraw: function () {
                    var modelJSON = this.dataModel ? this.dataModel.toJSON() : {},
                        uiModelJSON = this.uiModel.toJSON(),
                        json = _.extend(modelJSON, uiModelJSON);

                    json.t = function (name) {
                        return this.hasOwnProperty(name) ? this[name] : "";
                    };
                    this.el.html(this.templateFunction(json));
                    if (this.className) {
                        this.el.toggleClass(this.className, true);
                    }
                }
            }, classOptions);
        };

    return TemplatedInst;
};

