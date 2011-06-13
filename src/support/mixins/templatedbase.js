Ribs.support.mixins.templated = {
    templateSelector: null,
    templateString: null,
    models: null,

    mixinInitialize: function () {
        if (!this.templateString && this.templateSelector) {
            this.templateString = $(this.templateSelector).html();
        }

        if (!this.el && this.templateString) {
            this.el = $(this.templateString);
            console.log(this.templateString);
            this.templateString = $(this.templateString).html();
            console.log(this.templateString);
            this.templateFunction = this.templateString ? _.template(this.templateString) : null;
        }

        this.templateFunction = this.templateString ? _.template(this.templateString) : null;
    },
    redraw: function () {
        if (this.templateFunction) {
            $(this.el).html(this.templateFunction(this.json || {}));
        }
    }
};

