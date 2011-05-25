/**
 * @method
 * @desc Takes a Backbone.Model and adds property ribsUI
 * to it, which is another Backbone.Model. In this newly-created
 * Model that we at this point call ribsUI, we can store
 * transient properties that are related to the original Model,
 * but which we do not want to be persisted.<br /><br />
 *
 * For convenience, ribsUI Model bubbles all of its events to
 * its owner, with the prefix "ribsUI:".
 *
 * @param model Target of augmentation.
 */
Ribs.augmentModelWithUIAttributes = function (model) {
    if (!model.hasOwnProperty("ribsUI")) {
        model.ribsUI = new Backbone.Model();

        /**
         * @method
         * @desc safeUnbind method is added to the ribsUI model.
         * This is to circumvent a problem with Backbone event binding.
         * The regular unbind throws an error if you try to remove an
         * event that is currently being triggered.<br /><br />
         *
         * Anyway, do this until the next version of Backbone.js:
         * <a href="https://github.com/documentcloud/backbone/issues/309">https://github.com/documentcloud/backbone/issues/309</a>
         * @param ev Event name to unbind.
         * @param callback Callback the event is bound to. If none is
         * given, all callbacks for the event will be removed.
         */
        model.ribsUI.safeUnbind = function (ev, callback) {
            var calls, i, l, emptyFunction = function () { };
            if (!ev) {
                this._callbacks = {};
            } else {
                calls = this._callbacks;
                if (calls) {
                    if (!callback) {
                        calls[ev] = [];
                    } else {
                        var list = calls[ev];
                        if (!list) { return this; }
                        for (i = 0, l = list.length; i < l; i++) {
                            if (callback === list[i]) {
                                list[i] = emptyFunction;
                                break;
                            }
                        }
                    }
                }
            }
            return this;
        };

        model.ribsUI.set({ owner: model });
        model.ribsUI.bind("all", function (event) {
            var ev = "ribsUI:" + event;
            model.trigger(ev, Array.prototype.slice.call(arguments, 1));
        });
    }
};

/**
 * @method
 * @desc Safe logging into console.
 * @param msg Message or Object to log.
 */
Ribs.log = function (msg) {
    if (typeof(console) !== "undefined") {
        console.log(msg);
    }
};