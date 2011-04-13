Ribs.mixins.Selectable = function (myOptions) {
    myOptions = myOptions || {};

    var elementSelector = myOptions.elementSelector,
        SelectableClosure = function () {
            var that, elementClicked = function () {
                that.model.ribsUI.set({ selected: !that.model.ribsUI.get("selected") });
            };

            return {
                customInitialize: function () {
                    that = this;
                },
                modelChanged: function () {
                    this.model && this.model.ribsUI.set({ selected: false });
                },
                refresh: function () {
                    var $elem = elementSelector ? $(this.el).find(elementSelector) : $(this.el);
                    $elem
                            .unbind("click", elementClicked)
                            .bind("click", elementClicked)
                            .toggleClass("selected", this.model.ribsUI.get("selected"));
                }
            };
        };

    return SelectableClosure;
};

