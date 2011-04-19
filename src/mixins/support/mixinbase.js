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
    if (this.myOptions.elementSelector) {
        this.el = $(this.parent.el).find(this.myOptions.elementSelector);
    } else {
        this.el = $(this.parent.el);
    }
};
