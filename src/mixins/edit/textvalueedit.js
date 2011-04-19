Ribs.mixins.editable = function (myOptions) {
    myOptions = myOptions || {};

    var attributeName = myOptions.attributeName,
        TextValueEdit = function () {
            return _.extend(new Ribs.mixin.MixinBase(myOptions),
            {
                modelChanged: function () {
                    Ribs.mixin.MixinBase.prototype.modelChanged.apply(this, arguments);
                },
                redraw: function () {
                    Ribs.mixin.MixinBase.prototype.redraw.apply(this, arguments);
                    this.el.val(this.model.get(attributeName));
                },

                commit: function () {
                    var value = this.el.val();
                    this.model.set({ attributeName: value });
                }
            });
        };

    return TextValueEdit;
};

