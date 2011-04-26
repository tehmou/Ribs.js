(function(){
    var Ribs, resolveMixinClasses;

    Ribs = this.Ribs = {};

    Ribs.VERSION = '0.0.1';

    Ribs.mixins = {};

    Ribs.augmentModelWithUIAttributes = function (model) {
        if (!model.hasOwnProperty("ribsUI")) {
            model.ribsUI = new Backbone.Model();

            // Do this until the next version of Backbone.js:
            // https://github.com/documentcloud/backbone/issues/309
            model.ribsUI.safeUnbind = function (ev, callback) {
                var calls;
                if (!ev) {
                    this._callbacks = {};
                } else if (calls = this._callbacks) {
                    if (!callback) {
                        calls[ev] = [];
                    } else {
                        var list = calls[ev];
                        if (!list) return this;
                        for (var i = 0, l = list.length; i < l; i++) {
                            if (callback === list[i]) {
                                list[i] = function () { };
                                break;
                            }
                        }
                    }
                }
                return this;
            };
            
            model.ribsUI.set({ owner: model });
            model.ribsUI.bind("all", function (event) {
                var ev = "ribsUI:" + event;
                model.trigger(ev, Array.prototype.slice.call(arguments, 1));
            });
        }
    };

    Ribs.mixinMethods = ["customInitialize", "modelChanged", "render", "redraw", "refresh", "unbindEvents", "bindEvents", "hide", "dispose"];

    Ribs.createMixed = function (myOptions) {
        myOptions = myOptions || {};

        var resolveMixinClasses = function (myOptions) {
                var mixins = [],
                    mixinDefinions = myOptions.mixins || [];

                for (var i = 0, l = mixinDefinions.length; i < l; i++) {

                    var def = mixinDefinions[i];

                    _.each(def, function (options, name) {
                        var mixinFunction = Ribs.mixins[name]
                        if (!mixinFunction) {
                            throw "Could not find mixin " + name;
                        }

                        mixins.push(mixinFunction(options));
                    });
                }
                return mixins;
            },
            requireModel = myOptions.hasOwnProperty("requireModel") ? myOptions.requireModel : true,
            mixinClasses = myOptions.mixinClasses || resolveMixinClasses(myOptions),
            base = myOptions.base || null,
            Buildee = Ribs.ManagedView.extend(),
            delegateOneToMixins = function (methodName) {
                Buildee.prototype[methodName] = function () {
                    var doIt = function () {
                        Ribs.ManagedView.prototype[methodName].apply(this, arguments);
                        if (this.mixin && this.mixin[methodName]) {
                            this.mixin[methodName].apply(this.mixin, arguments);
                        }
                    };
    
                    doIt.apply(this, arguments);
                }
            },
            delegateToMixin = function (methods) {
                _.each(methods, function (methodName) { delegateOneToMixins(methodName); });
            };

        delegateToMixin(Ribs.mixinMethods);

        Buildee.prototype.initialize = function () {
            if (requireModel && !this.model) {
                throw "No model specified and requireModel==true";
            }
            var mixinClasses = this.getMixinClasses(),
                MixinComposite = Ribs.mixins.mixinComposite({ mixinClasses: mixinClasses });

            this.mixin = new MixinComposite({ parent: this });
            Ribs.ManagedView.prototype.initialize.apply(this, arguments);
        };

        Buildee.prototype.getMixinClasses = function () {
            var oldMixinClasses = [];
            if (base && base.prototype.getMixinClasses) {
                oldMixinClasses = base.prototype.getMixinClasses.apply(this, arguments);
            }
            return oldMixinClasses.concat(mixinClasses);
        };

        return Buildee;
    };

})();

