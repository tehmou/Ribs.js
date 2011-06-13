(function ($) {

    var methods = {
        createBackbone: function (options) {
            var view = Ribs.utils.addingExtend({}, Ribs.backbone.backbonePivot, options);

            return this.each(function () {
                if (this.ribsView) {
                    Ribs.throwError("multipleViewsForEl");
                }
                this.ribsView = _.extend({}, view, { el: this });
                this.ribsView.mixinInitialize();
                this.ribsView.render();
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

