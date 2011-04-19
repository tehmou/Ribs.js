Ribs.mixins.toggleButton = function (myOptions) {
    myOptions = myOptions || {};

    var usePlusMinus = myOptions.usePlusMinus || false,
        ToggleButton = function () {
            return _.extend(new Ribs.mixins.MixinBase(myOptions),
            {
                events: {
                    "click": "toggle"
                },
                modelChanged: function () {
                    Ribs.mixins.MixinBase.prototype.modelChanged.apply(this, arguments);
                    this.model && this.model.ribsUI.set({ open: false });
                },
                refresh: function () {
                    if (usePlusMinus) {
                        this.el.text(this.model.ribsUI.get("open") ? "-" : "+");
                    }
                    this.el.toggleClass("open", this.model.ribsUI.get("open"));
                },


                toggle: function () {
                    this.model.ribsUI.set({ open: !this.model.ribsUI.get("open") });
                }
            });
        };

    return ToggleButton;
};

