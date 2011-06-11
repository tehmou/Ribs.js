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
            this.templateFunction = _.template($(this.el.children()).html());
        }
    },
    redraw: function () {
        var json = {};
        if (_.isFunction(this.getMyModelJSON)) {
            json = this.getMyModelJSON() || json;
        } else if (this.models && _.isFunction(this.getModelJSON)) {
            json = this.getModelJSON(this.models);
        }
        if (this.templateFunction) {
            this.el.html(this.templateFunction(json || {}));
        }
    }
};

