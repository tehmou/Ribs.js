Thighbone.mixins.Templated = function (myOptions) {
    myOptions = myOptions || {};

    var tagClass = myOptions.tagClass,
        templateFunction = myOptions.templateFunction,
        InnerClosure = function () {
            return {
                redraw: function () {
                    var json = this.model ? this.model.toJSON() : {};
                    $(this.el).html(templateFunction(json));
                    tagClass && $(this.el).toggleClass(tagClass, true);
                }
            };
        };

    return InnerClosure;
};