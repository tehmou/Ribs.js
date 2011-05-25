/**
 * @method
 * @desc Mixin that toggles (shows/hides) its element based
 * on an attribute in the UI model. The attribute should be
 * truthy/falsy for predictable behavior.<br /><br />
 *
 * DOES NOT SUPPORT OBSERVING THE DATA MODEL.
 *
 * @param classOptions
 * @param classOptions.uiAttributeName To which UI attribute to
 * link the visibility of this element.
 * @param classOptions.inverse Make the element appear on false
 * and hide on true. The inverse, in other words.
 */
Ribs.mixins.toggleableElement = function (classOptions) {
    var ToggleableElementInst = function (parent) {
            var uiEventName;
            return _.extend({
                uiAttributeName: "open",
                inverse: false,

                modelChanging: function () {
                    if (this.uiModel && uiEventName) {
                        this.uiModel.unbind(uiEventName, this.attributeChanged);
                    }
                },
                modelChanged: function () {
                    if (this.uiModel) {
                        uiEventName = "change:" + this.uiAttributeName;
                        this.uiModel.bind(uiEventName, this.attributeChanged);
                    }
                },
                redraw: function () {
                    var value = this.myValue;
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

