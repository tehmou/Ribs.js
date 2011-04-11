Thighbone.mixins.Hoverable = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        InnerClosure = function () {
            var that,
                mouseOver = function () {
                    that.model.thighboneUI.set({ hovering: true });
                },
                mouseOut = function () {
                    that.model.thighboneUI.set({ hovering: false });
                };

            return {
                customInitialize: function () {
                    that = this;
                },
                modelChanged: function () {
                    this.model && this.model.thighboneUI.set({ hovering: false });
                },
                refresh: function () {
                    var $elem = elementSelector ? $(this.el).find(elementSelector) : $(this.el);
                    $elem
                            .unbind("mouseover", mouseOver)
                            .unbind("mouseout", mouseOut)
                            .bind("mouseover", mouseOver)
                            .bind("mouseout", mouseOut)
                            .toggleClass("hovering", this.model.thighboneUI.get("hovering"));
                }
            };
        };

    return InnerClosure;
};