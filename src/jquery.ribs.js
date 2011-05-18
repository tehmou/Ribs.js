(function ($) {

    var methods = {
        createView: function (options) {
            options = options || {};
            var View;
            if (options.view) {
                View = typeof(options.view) === "function" ? options.view : Ribs.createMixed(options.view);
            } else if (options.mixins) {
                View = Ribs.createMixed({ mixins: options.mixins });                
            }

            if (!View) {
                if (!View) {
                    $.error("options.view was not defined when calling jQuery.ribs createMixed");
                }
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

    $.fn.ribs = function (method) {
        if (methods.hasOwnProperty(method)) {
            return methods[method].apply(this, Array.prototype.splice.call(arguments, 1));
        } else {
            $.error("Method " + method + " does not exist on jQuery.ribs");
        }
    };

}($));

