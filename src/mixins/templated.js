Ribs.mixins.Templated = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        templateFunction = myOptions.templateFunction,
        className = myOptions.className,
        TemplatedClosure = function () {
            var parent, that = {
                    entryPoints: {
                        mixinInitialize: function (value) {
                            parent = value;
                        },
                        redraw: function () {
                            that.el = elementSelector ? $(parent.el).find(elementSelector) : $(parent.el);

                            var json = parent.model ? (parent.model.toJSON ? parent.model.toJSON() : parent.model) : {};
                            json.t = function (name) {
                                return this.hasOwnProperty(name) ? this[name] : "";
                            };
                            that.el.html(templateFunction(json));
                            className && that.el.toggleClass(className, true);
                        }
                    }
                };
            
            return that;
        };

    return TemplatedClosure;
};

