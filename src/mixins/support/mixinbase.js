Ribs.mixins.MixinBase = function (myOptions) {
    this.myOptions = myOptions || {};
};

Ribs.mixins.MixinBase.prototype.customInitialize = function () {
    _.bindAll(this);
};

Ribs.mixins.MixinBase.prototype.modelChanged = function () {
    this.model = this.parent.model;
};

Ribs.mixins.MixinBase.prototype.redraw = function () {
    var selector = this.myOptions.elementSelector || this.myOptions.es;
    if (selector) {
        this.el = $(this.parent.el).find(selector);
    } else {
        this.el = $(this.parent.el);
    }
};
