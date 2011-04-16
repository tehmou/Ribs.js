Ribs.mixins.Hoverable = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        HoverableClosure = function () {
            var that,
                mouseOver = function () {
                    that.model.ribsUI.set({ hovering: true });
                    that.render();
                },
                mouseOut = function () {
                    that.model.ribsUI.set({ hovering: false });
                    that.render();
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
                            .toggleClass("hovering", this.model.ribsUI.get("hovering"))
                            .unbind("mouseenter", mouseOver)
                            .unbind("mouseleave", mouseOut)
                            .mouseenter(mouseOver)
                            .mouseleave(mouseOut);
                }
            };
        };

    return HoverableClosure;
};

