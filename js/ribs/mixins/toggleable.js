Ribs.mixins.Toggleable = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        usePlusMinus = myOptions.usePlusMinus,
        InnerClosure = function () {
            var that,
                toggle = function () {
                    that.model.ribsUI.set({ open: !that.model.ribsUI.get("open") });
                };

            return {
                customInitialize: function () {
                    that = this;
                },
                modelChanged: function () {
                    this.model.ribsUI.set({ open: false });
                },
                refresh: function () {
                    var $elem = elementSelector ? $(this.el).find(elementSelector) : $(this.el);
                    $elem
                            .unbind("click", toggle)
                            .bind("click", toggle);
                    if (usePlusMinus) {
                        $elem.text(this.model.ribsUI.get("open") ? "-" : "+");
                    }
                }
            };
        };

    return InnerClosure;
};