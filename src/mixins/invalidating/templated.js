Ribs.mixins.templated = function (classOptions) {
    classOptions = classOptions || {};
    var defaultTemplateFunction = classOptions.templateSelector && _.template($(classOptions.templateSelector).html()),
        TemplatedInst = function (parent) {
                return _.extend({
                    templateSelector: null,
                    templateFunction: defaultTemplateFunction,
                    modelNames: ["data", "dataUI"],
                    className: null,

                    redraw: function () {
                        var modelJSON = {};
                        for (var i = 0; i < this.modelNames.length; i++) {
                            var modelName = this.modelNames[i];
                            if (parent && parent.ribsUIModels && parent.ribsUIModels.get(modelName)) {
                                modelJSON = _.extend(modelJSON, parent.ribsUIModels.get(modelName).toJSON());
                            }
                        }
                        modelJSON.t = function (name) {
                            return this.hasOwnProperty(name) ? this[name] : "";
                        };
                        this.el.html(this.templateFunction(modelJSON));
                        if (this.className) {
                            this.el.toggleClass(this.className, true);
                        }
                    }
                }, Ribs.mixinBase.plain, classOptions);
            };

    return TemplatedInst;
};

