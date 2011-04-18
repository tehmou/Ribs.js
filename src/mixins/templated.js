Ribs.mixins.templated = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        templateFunction = myOptions.templateFunction,
        className = myOptions.className,
        Templated = function (parent) {
            var mixin = {
                    managedViewMethods: {
                        redraw: function () {
                            mixin.el = elementSelector ? $(parent.el).find(elementSelector) : $(parent.el);

                            var json = parent.model ? (parent.model.toJSON ? parent.model.toJSON() : parent.model) : {};
                            json.t = function (name) {
                                return this.hasOwnProperty(name) ? this[name] : "";
                            };
                            mixin.el.html(templateFunction(json));
                            className && mixin.el.toggleClass(className, true);
                        }
                    }
                };
            
            return mixin;
        };

    return Templated;
};

