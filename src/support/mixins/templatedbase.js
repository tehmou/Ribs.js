Ribs.support.mixins.templated = {
    templateSelector: null,
    templateString: null,
    templateFunction: null,
    overwriteEl: false,
    models: null,
    

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
    redraw: function () {
        if (this.templateFunction) {
            if (this.overwriteEl) {
                this.el = $(this.templateFunction(this.json || {}));
            } else {
                $(this.el).html(this.templateFunction(this.json || {}));
            }
        }
    }
};

