Ribs.mixins.templated = {
    templateSelector: null,
    templateFunction: null,
    models: null,

    mixinInitialize: function () {
        if (!this.templateFunction && this.templateSelector) {
            this.templateFunction = _.template($(this.templateSelector).html());
        }
        if (!this.el && this.templateFunction) {
            this.el = $(this.templateFunction({}));
            this.templateFunction = _.template(this.el.html());
        }
    },
    redraw: function () {
        if (this.templateFunction) {
            this.el.html(this.templateFunction(this.json || {}));
        }
    }
};

