Ribs.mixins.editable = function (myOptions) {
    myOptions = myOptions || {};

    var forceShow = myOptions.forceShow || false,
        Editable = function () {
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
                    if (forceShow) {
                        this.el.toggle(true);                        
                    }
                },

                edit: function () {
                    this.model.ribsUI.set({ editing: true });
                }
            });
        };

    return Editable;
};

