Ribs.mixins.templated = {
    templateFunction: function () { return ""; },
    redraw: function () {
        this.el.html(this.templateFunction({}));
    }
};

