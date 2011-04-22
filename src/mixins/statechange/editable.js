Ribs.mixins.editable = function (classOptions) {
    classOptions = classOptions || {};

    var forceShow = classOptions.forceShow || false,
        Editable = function (instanceOptions) {
            return _.extend(new Ribs.MixinBase(classOptions, instanceOptions), {
                events: {
                    "click": "edit"
                },
                modelChanged: function () {
                    Ribs.MixinBase.prototype.modelChanged.apply(this, arguments);
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

