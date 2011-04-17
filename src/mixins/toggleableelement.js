Ribs.mixins.ToggleableElement = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        ToggleableElementClosure = function () {
            var that,
                openChanged = function () {
                    that && (that.invalidated = true);
                };

            return {
                customInitialize: function () {
                    that = this;
                },
                modelChanged: function () {
                    this.model && this.model.ribsUI.bind("change:open", openChanged);
                },
                redraw: function () {
                    var $elem = elementSelector ? $(this.el).find(elementSelector) : $(this.el);
                    $elem.toggle(this.model.ribsUI.get("open"));
                }
            };
        };

    return ToggleableElementClosure;
};

