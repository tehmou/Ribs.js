/**
 * @class
 * @requires Ribs.mixins.support.dom.element
 */
Ribs.mixins.support.templated = {
    /**
     * @field
     * @desc jQuery selector for the template element.
     * @default null
     */
    templateSelector: null,

    /**
     * @field
     * @desc Plain string to use as the template.<br /><br />
     *
     * Overrides templateSelector.
     * @default null
     */
    templateString: null,

    /**
     * @field
     * @desc Template function to call when using the template.
     * Gets the model json as its first parameter.<br /><br />
     *
     * Overrides templateSelector and templateString
     * @default null
     */
    templateFunction: null,

    /**
     * @field
     * @desc If set to true, will replace the el property with the
     * template element. Otherwise replaces the contents of the el
     * with the templated element, leaving the root tag.<br /><br />
     *
     * Notice that you will have to re-append this el to DOM manually
     * in case it is overwritten.<br /><br />
     * @default false
     */
    overwriteEl: false,

    /**
     * @field
     * @desc "Data" to give to the template function. Should be
     * calculated right before rendering the template in redraw.
     */
    json: null,

    /**
     * @method
     * @desc Initializes the template based on the mentioned fields.
     */
    mixinInitialize: function () {
        if (!this.templateFunction) {
            if (this.templateSelector && !this.templateString) {
                this.templateString = $(this.templateSelector).html();
            }
            if (this.templateString) {
                this.templateFunction = _.template(this.templateString);
            }
        }
    },

    /**
     * @method
     * @desc This is where the template is applied.
     */
    redraw: function () {
        this.applyTemplate();
    },

    /**
     * @method
     */
    applyTemplate: function () {
        if (this.templateFunction) {
            if (this.overwriteEl) {
                this.el = $(this.templateFunction(this.json || {}));
            } else {
                $(this.el).html(this.templateFunction(this.json || {}));
            }
        }
    }
};

