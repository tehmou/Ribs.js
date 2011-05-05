/*global $,_,Backbone,console*/

var Ribs = {};

Ribs.VERSION = '0.0.82';

Ribs.mixins = {};

Ribs.mixinMethods = [
    "customInitialize",
    "modelChanging", "modelChanged",
    "render", "redraw", "refresh",
    "unbindEvents", "bindEvents",
    "hide", "dispose"
];

Ribs.createMixed = function (myOptions) {
    myOptions = myOptions || {};

    var Buildee = Ribs.ManagedView.extend(),
        NewRootMixin = Ribs.mixins.mixinComposite(myOptions),
        OldRootMixin = myOptions.base && myOptions.base.RootMixin,

        delegateOneToRootMixin = function (methodName) {
            Buildee.prototype[methodName] = function () {
                Ribs.ManagedView.prototype[methodName].apply(this, arguments);
                if (this.rootMixin && this.rootMixin[methodName]) {
                    this.rootMixin[methodName].apply(this.rootMixin, arguments);
                }
            };
        };

    _.each(Ribs.mixinMethods, delegateOneToRootMixin);

    if (OldRootMixin) {
        Buildee.RootMixin = Ribs.mixins.mixinComposite({
            mixinClasses: [OldRootMixin, NewRootMixin]
        });
    } else {
        Buildee.RootMixin = NewRootMixin;
    }

    Buildee.prototype.initialize = function () {
        this.rootMixin = new Buildee.RootMixin(this, this.options.model);
        Ribs.ManagedView.prototype.initialize.apply(this, arguments);
    };

    return Buildee;
};

