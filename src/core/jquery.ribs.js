(function ($) {

    var methods = {
        createView: function (view, options) {
            return this.each(function () {
                if (this.ribsView) {
                    Ribs.throwError("multipleViewsForEl");
                }

                var ribsView = Ribs.compose("pivot", {
                    mixinDefinitions: view,
                    el: this
                }, options || {});
                ribsView.mixinInitialize();
                ribsView.render();
                this.ribsView = ribsView;
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

