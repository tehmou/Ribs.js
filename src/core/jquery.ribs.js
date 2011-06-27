(function ($) {

    var methods = {
        createView: function () {
            var originalArguments = _.toArray(arguments);

            return this.each(function () {
                if (this.ribsView) {
                    Ribs.throwError("multipleViewsForEl");
                }

                var ribsView = Ribs.compose.apply(null, originalArguments);
                ribsView.el = this;

                if (_.isFunction(ribsView.mixinInitialize)) {
                    ribsView.mixinInitialize();
                }
                if (_.isFunction(ribsView.render)) {
                    ribsView.render();
                }
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

