Ribs.mixinBase.pivot = {
    tagName: "div",
    el: null,
    invalidated: false,
    models: {},

    /**
     * @method
     * @desc Create "el" if it does not already exist.
     */
    initialize: function () {
        this.el = this.el || document.createElement(this.tagName || "div");
        this.pivot = this;
        Ribs.mixinBase.parsing.mixinInitialize.apply(this, arguments);
        Ribs.mixinBase.composite.mixinInitialize.apply(this, arguments);
    },

    render: function () { },

    /**
     * @method
     * @desc Default pivot behavior calls $(this.el).detach();
     */
    hide: function () {
        $(this.el).detach();
    },

    /**
     * @method
     * @desc Default pivot behavior calls $(this.el).remove();
     */
    dispose: function () {
        $(this.el).remove();
    }

};