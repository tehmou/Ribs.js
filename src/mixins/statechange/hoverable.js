Ribs.mixins.hoverable = function (myOptions) {
    var Hoverable = function () {
            return _.extend(new Ribs.mixins.MixinBase(myOptions),
            {
                modelChanged: function () {
                    Ribs.mixins.MixinBase.prototype.modelChanged.apply(this, arguments);
                    this.model && this.model.ribsUI.set({ hovering: false });
                },
                refresh: function () {
                    this.el
                            .mouseenter(this.mouseOver)
                            .mouseleave(this.mouseOut)
                            .toggleClass("hovering", this.model.ribsUI.get("hovering"));
                },

                mouseOver: function () {
                    this.model.ribsUI.set({ hovering: true });
                },
                mouseOut: function () {
                    this.model.ribsUI.set({ hovering: false });
                }
            });
        };

    return Hoverable;
};

