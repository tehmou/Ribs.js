/*global $,_,Backbone,console*/

/**
 * Ribs.js 0.0.84
 *     (c) 2011 Timo Tuominen
 *     Ribs.js may be freely distributed under the MIT license.
 *     For all details and documentation:
 *     http://tehmou.github.com/ribs.js
**/

var Ribs = {};

Ribs.VERSION = "0.0.84";

Ribs.mixins = {};

Ribs.mixinMethods = [
    "customInitialize",
    "bindToModel",
    "render", "redraw", "refresh",
    "unbindEvents", "bindEvents",
    "hide", "dispose"
];

Ribs.inheritingMixinProperties = [
    "attributeName", "modelName"
];


/**
* Creates a Backbone.View that inherits Ribs.ManagedView
* and contains the mixins defined in myOptions.
**/
Ribs.createMixed = function (myOptions) {
    myOptions = myOptions || {};

    var Buildee = myOptions.base ? myOptions.base.extend() : Ribs.ManagedView.extend(),
        NewRootMixin = Ribs.mixinParser.createMixinFromDefinitions(myOptions.mixins),
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
        if (typeof(Buildee.RootMixin) === "function") {
            this.rootMixin = new Buildee.RootMixin(this, this.options.model);
        } else {
            this.rootMixin = _.extend({}, Buildee.RootMixin);
        }
        Ribs.ManagedView.prototype.initialize.apply(this, arguments);
    };

    return Buildee;
};

