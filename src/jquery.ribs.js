(function ($) {

    var methods = {
        createMixed: function (options) {
            var View = typeof(options.view) === "function" ? options.view : Ribs.createMixed(options.view);
            if (!View) {
                $.error("options.view was not defined when calling jQuery.ribs createMixed");
            }
            return this.each(function () {
                if (this.ribsView) {
                    if (typeof(this.ribsView.dispose) === "function") {
                        this.ribsView.dispose();
                    }
                }
                this.ribsView = new View($.extend(options.options || {}, { el: this }));
            });
        }
    };

    $.fn.ribs = function (method, options) {
        if (methods.hasOwnProperty(method)) {
            return methods[method].apply(this, Array.prototype.splice(arguments, 1));
        } else {
            $.error("Method " + method + " does not exist on jQuery.ribs");
        }
    };

}());

