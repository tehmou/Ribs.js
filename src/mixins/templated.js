Ribs.mixins.templated = function (myOptions) {
    myOptions = myOptions || {};

    var templateFunction = myOptions.templateFunction,
        className = myOptions.className,
        Templated = function () {
            return _.extend(new Ribs.mixins.MixinBase(myOptions),
            {
                redraw: function () {
                    Ribs.mixins.MixinBase.prototype.redraw.apply(this, arguments);

                    var json = this.model ? (this.model.toJSON ? this.model.toJSON() : this.model) : {};
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

