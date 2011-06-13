Ribs.support.mixins.pivotEl = {
    tagName: "div",
    el: null,
    initialized: false,

    /**
     * @method
     * @desc Create "el" if it does not already exist.
     */
    mixinInitialize: function () {
        this.el = this.el || document.createElement(this.tagName || "div");
        this.pivot = this;
    },

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

