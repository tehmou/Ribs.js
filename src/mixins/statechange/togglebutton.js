Ribs.mixins.toggleButton = function (classOptions) {
    classOptions = classOptions || {};

    var usePlusMinus = classOptions.usePlusMinus || false,
        ToggleButton = function (instanceOptions) {
            return _.extend(new Ribs.MixinBase(classOptions, instanceOptions), {
                events: {
                    "click": "toggle"
                },
                modelChanged: function () {
                    Ribs.MixinBase.prototype.modelChanged.apply(this, arguments);
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

