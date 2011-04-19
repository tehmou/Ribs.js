Ribs.mixins.editable = function (myOptions) {
    var Editable = function () {
            return _.extend(new Ribs.mixins.MixinBase(myOptions), {
                events: {
                    "click": "edit"
                },
                modelChanged: function () {
                    Ribs.mixins.MixinBase.prototype.modelChanged.apply(this, arguments);
                    if (this.model && !this.model.ribsUI.attributes.hasOwnProperty("editing")) {
                        this.model.ribsUI.set({ editing: false });
                    }
                },
                refresh: function () {
                    this.el.toggle(true);
                },

                edit: function () {
                    this.model.ribsUI.set({ editing: true });
                }
            });
        };

    return Editable;
};

