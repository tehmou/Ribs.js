Ribs.mixins.selectable = function (myOptions) {
    var Selectable = function () {
            return _.extend(new Ribs.mixins.MixinBase(myOptions),
            {
                events: {
                    "click": "elementClicked"
                },
                modelChanged: function () {
                    Ribs.mixins.MixinBase.prototype.modelChanged.apply(this, arguments);
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

