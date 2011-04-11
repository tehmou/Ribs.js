Thighbone.mixins.ToggleableElement = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        InnerClosure = function () {
            var that,
                openChanged = function () {
                    that.invalidated = true;
                };

            return {
                customInitialize: function () {
                    that = this;
                },
                modelChanged: function () {
                    this.model.bind("thighbone:ui:open", openChanged);
                },
                redraw: function () {
                    var $elem = elementSelector ? $(this.el).find(elementSelector) : $(this.el);
                    $elem.toggle(this.model.thighboneUI.get("open"));
                }
            };
        };

    return InnerClosure;
};