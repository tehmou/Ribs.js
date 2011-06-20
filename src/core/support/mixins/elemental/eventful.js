(function () {
    var eventSplitter = /^(\w+)\s*(.*)$/;

    /**
     * @class
     * @desc Resolves and assigns DOM listeners for
     * events defined in events property.
     *
     * @requires Ribs.support.mixins.element
     * @requires Ribs.support.mixins.renderChain
     */
    Ribs.support.mixins.eventful = {
        /**
         * @field
         * @desc Hash of events to listen. Key is of form
         * "&lt;event&gt; &lt;selector&gt;" and value is the
         * name of the function to call on trigger.
         */
        events: {},

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

