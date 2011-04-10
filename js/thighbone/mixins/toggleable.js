Thighbone.mixins.Toggleable = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        usePlusMinus = myOptions.usePlusMinus,
        InnerClosure = function () {
            var that,
                toggle = function () {
                    that.model.thighboneUI.set({ open: !that.model.thighboneUI.get("open") });
                };

            return {
                customInitialize: function () {
                    that = this;
                    this.model.thighboneUI.set({ open: false });
                },
                refresh: function () {
                    var $elem = elementSelector ? $(this.el).find(elementSelector) : $(this.el);
                    $elem
                            .unbind("click", toggle)
                            .bind("click", toggle);
                    if (usePlusMinus) {
                        $elem.text(this.model.thighboneUI.get("open") ? "-" : "+");
                    }
                }
            };
        };

    return InnerClosure;
};