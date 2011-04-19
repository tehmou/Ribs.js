Ribs.mixins.toggleableElement = function (myOptions) {
    myOptions = myOptions || {};

    var uiAttributeName = myOptions.uiAttributeName || "open",
        inverse = myOptions.inverse || false,
        ToggleableElement = function () {
            return _.extend(new Ribs.mixins.MixinBase(myOptions),
            {
                modelChanged: function () {
                    var ev = "change:" + uiAttributeName;
                    if (this.model) {
                        this.model.ribsUI.unbind(ev, this.attributeChanged);
                    }
                    Ribs.mixins.MixinBase.prototype.modelChanged.apply(this, arguments);
                    if (this.model) {
                        this.model.ribsUI.bind(ev, this.attributeChanged);
                    }
                },
                redraw: function () {
                    Ribs.mixins.MixinBase.prototype.redraw.apply(this, arguments);
                    var value = this.model.ribsUI.get(uiAttributeName);
                    inverse && (value = !value);
                    this.el.toggle(value);
                },


                attributeChanged: function () {
                    this.parent && (this.parent.invalidated = true);
                }
            });
        };

    return ToggleableElement;
};

