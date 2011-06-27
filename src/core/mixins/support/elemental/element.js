/**
 * @class
 * @desc Create "el" in mixinInitialize if it does not already exist.
 */
Ribs.mixins.support.element = {
    /**
     * @field
     * @desc Name of the tag to create, if no el was provided.
     * @default null
     */
    tagName: null,

    /**
     * @field
     * @desc If given, no element will be created, but it will
     * be used instead.
     */
    el: null,

    /**
     * @field
     */
    inheritingProperties: ["pivot"],

    mixinInitialize: function () {
        this.el = this.el || document.createElement(this.tagName || "div");
        this.pivot = this;
    }
};

