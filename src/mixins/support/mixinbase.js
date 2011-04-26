(function() {
    
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

Ribs.MixinBase.prototype.unbindEvents = function () {
    this.el.unbind();
};

var eventSplitter = /^(\w+)\s*(.*)$/;
Ribs.MixinBase.prototype.bindEvents = function (events) {
    if (!(events || (events = this.events))) return;
    for (var key in events) {
      var methodName = events[key];
      var match = key.match(eventSplitter);
      var eventName = match[1], selector = match[2];
      var method = _.bind(this[methodName], this);
      if (selector === '') {
        $(this.el).bind(eventName, method);
      } else {
        $(this.el).delegate(selector, eventName, method);
      }
    }
};

})();