Ribs.mixins.toggleableElement = function (classOptions) {
    var ToggleableElementInst = function (parent) {
            var model, uiEventName;
            return _.extend({
                modelName: "dataUI",
                attributeName: "open",
                inverse: false,

                modelChanging: function () {
                    if (model && uiEventName) {
                        model.unbind(uiEventName, this.attributeChanged);
                    }
                },
                modelChanged: function () {
                    model = this.getMyModel();
                    if (model) {
                        uiEventName = "change:" + this.attributeName;
                        model.bind(uiEventName, this.attributeChanged);
                    }
                },
                redraw: function () {
                    var value = this.getMyValue();
                    if (this.inverse) {
                        value = !value;
                    }
                    this.el.toggle(value);
                },

                attributeChanged: function () {
                    parent.invalidated = true;
                }
            }, classOptions || {});
        };

    return ToggleableElementInst;
};

