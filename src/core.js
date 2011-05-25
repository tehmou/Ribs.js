/*global $,_,Backbone,console*/

/**
 * @namespace Ribs.js 0.0.831
 *     (c) 2011 Timo Tuominen
 *     Ribs.js may be freely distributed under the MIT license.
 *     For all details and documentation:
 *     <a href="http://tehmou.github.com/ribs.js">http://tehmou.github.com/ribs.js</a>
**/
var Ribs = {};

Ribs.VERSION = '0.0.831';

/**
 * @class Hash of all mixins visible to the mixin
 * parser. Add your custom ones here.
 * */
Ribs.mixins = {};

/**
 * @field
 * @desc List of ManagedView methods that are delegated to all mixins.
 * */
Ribs.mixinMethods = [
    "customInitialize",
    "modelChanging", "modelChanged",
    "render", "redraw", "refresh",
    "unbindEvents", "bindEvents",
    "hide", "dispose"
];

/**
 * @method
 * @desc Creates a Backbone.View that inherits Ribs.ManagedView
 * and contains the mixins defined in myOptions.
*/
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

