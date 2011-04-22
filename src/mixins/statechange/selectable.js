Ribs.mixins.selectable = function (classOptions) {
    var Selectable = function (instanceOptions) {
            return _.extend(new Ribs.MixinBase(classOptions, instanceOptions), {
                events: {
                    "click": "elementClicked"
                },
                modelChanged: function () {
                    Ribs.MixinBase.prototype.modelChanged.apply(this, arguments);
                    this.model && this.model.ribsUI.set({ selected: false });
                },
                refresh: function () {
                    this.el.toggleClass("selected", this.model.ribsUI.get("selected"));
                },

                elementClicked: function () {
                    this.model.ribsUI.set({ selected: !this.model.ribsUI.get("selected") });
                }
            });
        };
    
    return Selectable;
};

