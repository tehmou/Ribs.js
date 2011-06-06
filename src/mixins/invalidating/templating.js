Ribs.mixins.templating = {
    templateFunction: function () { return ""; },
    redraw: function () {
        this.el.html(this.templateFunction({}));
    }
};

