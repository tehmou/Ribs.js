Ribs.mixins.toggleableElement = function (myOptions) {
    myOptions = myOptions || {};

    var uiAttributeName = myOptions.uiAttributeName || "open",
        reverse = myOptions.reverse || false,
        ToggleableElement = function () {
            return _.extend(new Ribs.mixins.MixinBase(myOptions),
            {
                modelChanged: function () {
                    Ribs.mixins.MixinBase.prototype.modelChanged.apply(this, arguments);
                    var ev = "change:" + uiAttributeName;
                    this.model && this.model.ribsUI.bind(ev, this.attributeChanged);
                },
                redraw: function () {
                    Ribs.mixins.MixinBase.prototype.redraw.apply(this, arguments);
                    var value = this.model.ribsUI.get(uiAttributeName);
                    reverse && (value = !value);
                    this.el.toggle(value);
                },


                attributeChanged: function () {
                    this.parent && (this.parent.invalidated = true);
                }
            });
        };

    return ToggleableElement;
};

