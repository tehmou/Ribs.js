Thighbone.mixins.Templated = function (myOptions) {
    myOptions = myOptions || {};

    var templateFunction = myOptions.templateFunction,
        InnerClosure = function () {
            return {
                redraw: function () {
                    var json = this.model ? this.model.toJSON() : {};
                    $(this.el).html(templateFunction(json));
                }
            };
        };

    return InnerClosure;
};