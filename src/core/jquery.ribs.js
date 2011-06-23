(function ($) {

    var methods = {
        createView: function (view) {
            return this.each(function () {
                if (this.ribsView) {
                    Ribs.throwError("multipleViewsForEl");
                }

                var ribsView = _.extend({}, Ribs.mixins.pivot, {
                    mixinDefinitions: view,
                    el: this
                });
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

