Ribs.mixins.Hoverable = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        HoverableClosure = function () {
            var that,
                mouseOver = function () {
                    that.model.ribsUI.set({ hovering: true });
                },
                mouseOut = function () {
                    that.model.ribsUI.set({ hovering: false });
                };

            return {
                customInitialize: function () {
                    that = this;
                },
                modelChanged: function () {
                    this.model && this.model.ribsUI.set({ hovering: false });
                },
                refresh: function () {
                    var $elem = elementSelector ? $(this.el).find(elementSelector) : $(this.el);
                    $elem
                            .unbind("mouseenter", mouseOver)
                            .unbind("mouseleave", mouseOut)
                            .bind("mouseenter", mouseOver)
                            .bind("mouseout", mouseOut)
                            .toggleClass("hovering", this.model.ribsUI.get("hovering"));
                }
            };
        };

    return HoverableClosure;
};

