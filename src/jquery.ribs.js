(function ($) {

    Ribs.allowMultipleViewForEl = false;

    var methods = {
        createBackbone: function (options) {
            options = options || {};

            var view = _.extend({}, Ribs.mixins.backbonePivot, options.options);

            return this.each(function () {
                if (!Ribs.allowMultipleViewForEl && this.ribsView) {
                    throw "Tried to initialize another ribs for this el";
                }
                this.ribsView = _.extend({ el: this }, view);
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

