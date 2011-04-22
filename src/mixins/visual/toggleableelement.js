Ribs.mixins.toggleableElement = function (classOptions) {
    classOptions = classOptions || {};

    var uiAttributeName = classOptions.uiAttributeName || "open",
        inverse = classOptions.inverse || false,
        ToggleableElement = function (instanceOptions) {
            return _.extend(new Ribs.MixinBase(classOptions, instanceOptions), {
                modelChanged: function () {
                    var ev = "change:" + uiAttributeName;
                    if (this.model) {
                        this.model.ribsUI.unbind(ev, this.attributeChanged);
                    }
                    Ribs.MixinBase.prototype.modelChanged.apply(this, arguments);
                    if (this.model) {
                        this.model.ribsUI.bind(ev, this.attributeChanged);
                    }
                },
                redraw: function () {
                    Ribs.MixinBase.prototype.redraw.apply(this, arguments);
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

