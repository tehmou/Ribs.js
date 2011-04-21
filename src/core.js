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

    resolveMixinClasses = function (myOptions) {
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
    };

    Ribs.createMixed = function (myOptions) {
        myOptions = myOptions || {};

        var requireModel = myOptions.hasOwnProperty("requireModel") ? myOptions.requireModel : true,
            mixinClasses = myOptions.mixinClasses || resolveMixinClasses(myOptions),
            base = myOptions.base || null,
            Buildee = Ribs.ManagedView.extend(),
            delegateOneToMixins = function (methodName) {
                Buildee.prototype[methodName] = function () {
                    var doIt = function () {
                        Ribs.ManagedView.prototype[methodName].apply(this, arguments);
                        _.each(this.mixins, _.bind(function (mixin) {
                            mixin[methodName] && mixin[methodName].apply(mixin, arguments);
                        }, this));
                    };
    
                    doIt.apply(this, arguments);
                }
            },
            delegateToMixins = function (methods) {
                _.each(methods, function (methodName) { delegateOneToMixins(methodName); });
            };

        Buildee.prototype.initialize = function () {
            if (requireModel && !this.model) {
                throw "No model specified and requireModel==true";
            }
            var mixinClasses = this.getMixinClasses();
            this.mixins = [];
            _.each(mixinClasses, _.bind(function (Mixin) {
                var mixin = new Mixin();
                mixin.parent = this;
                this.mixins.push(mixin);
            }, this));


            Ribs.ManagedView.prototype.initialize.apply(this, arguments);
        };

        Buildee.prototype.delegateEvents = function () {
            Backbone.View.prototype.delegateEvents.apply(this, arguments);
            _.each(this.mixins, function (mixin) {
                Backbone.View.prototype.delegateEvents.apply(mixin);
            });
        };
        delegateToMixins(["customInitialize", "modelChanged", "render", "redraw", "refresh", "hide", "dispose"]);

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

