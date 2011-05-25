/**
 * @method
 * @desc Uses a given template to replace the contents
 * of its element. Gives the template the data and UI models
 * as json, the latter overriding the former.
 *
 * @param classOptions
 * @param classOptions.templateSelector Selector for the template.
 * Plain string that jQuery can handle.
 * @param classOptions.templateFunction Function that takes json as
 * its parameter and returns HTML. Overrides templateSelector if both
 * are given.
 * @param classOptions.className Templates do not affect the root element
 * of a Backbone.View, and the same applies to Ribs.js mixins. If you wish
 * to have a certain class for the root DOM element, set this property to
 * that class and it will be passed to the element.
 */
Ribs.mixins.templated = function (classOptions) {
    classOptions = classOptions || {};
    var defaultTemplateFunction = classOptions.templateSelector && _.template($(classOptions.templateSelector).html()),
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

