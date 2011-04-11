Thighbone.mixins.Selectable = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        InnerClosure = function () {
            var that, elementClicked = function () {
                that.model.thighboneUI.set({ selected: !that.model.thighboneUI.get("selected") });
            };

            return {
                customInitialize: function () {
                    that = this;
                },
                modelChanged: function () {
                    this.model.thighboneUI.set({ selected: false });
                },
                refresh: function () {
                    var $elem = elementSelector ? $(this.el).find(elementSelector) : $(this.el);
                    $elem
                            .unbind("click", elementClicked)
                            .bind("click", elementClicked)
                            .toggleClass("selected", this.model.thighboneUI.get("selected"));
                }
            };
        };

    return InnerClosure;
};