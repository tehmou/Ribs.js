(function () {
    var eventSplitter = /^(\w+)\s*(.*)$/;
    Ribs.mixinBase.eventful = {
        unbindEvents: function () {
            if (this.el) {
                this.el.unbind();
            }
        },
        bindEvents: function () {
            if (!this.events || !this.el) {
                return;
            }
            _.each(this.events, _.bind(function (methodName, key) {
                var match = key.match(eventSplitter),
                        eventName = match[1], selector = match[2],
                        method = _.bind(this[methodName], this);
                if (selector === '') {
                    this.el.bind(eventName, method);
                } else {
                    this.el.delegate(selector, eventName, method);
                }
            }, this));
        }
    };
}());

