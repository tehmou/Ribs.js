Ribs.mixins.hoverable = function (classOptions) {
    var Hoverable = function (instanceOptions) {
            return _.extend(new Ribs.MixinBase(classOptions, instanceOptions), {
                modelChanged: function () {
                    Ribs.MixinBase.prototype.modelChanged.apply(this, arguments);
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

