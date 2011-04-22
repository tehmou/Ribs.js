Ribs.MixinBase = function (classOptions, instanceOptions) {
    classOptions = classOptions || {};
    instanceOptions = instanceOptions || {};
    this.myOptions = _.extend(classOptions, instanceOptions);
    
    this.parent = this.myOptions.parent;
    if (!this.parent) {
        throw "No parent defined for mixin";
    }
};

Ribs.MixinBase.prototype.customInitialize = function () {
    _.bindAll(this);
};

Ribs.MixinBase.prototype.modelChanged = function () {
    this.model = this.parent.model;
};

Ribs.MixinBase.prototype.redraw = function () {
    var selector = this.myOptions.elementSelector || this.myOptions.es;
    if (selector) {
        this.el = $(this.parent.el).find(selector);
    } else {
        this.el = $(this.parent.el);
    }
};

Ribs.MixinBase.prototype.delegateEvents = function () {
    Backbone.View.prototype.delegateEvents.apply(this, arguments);
};