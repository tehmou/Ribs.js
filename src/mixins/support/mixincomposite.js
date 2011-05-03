Ribs.mixins.mixinComposite = function (classOptions) {
    classOptions = classOptions || {};

    var elementSelector = classOptions.elementSelector,
        mixinClasses = classOptions.mixinClasses || Ribs.parseMixinDefinitions(classOptions.mixins),
        callAllMixins = function (mixins, methodName, originalArguments) {
            _.each(mixins, function (mixin) {
                if (mixin[methodName]) {
                    mixin[methodName].apply(mixin, originalArguments);
                }
            });
        },
        eventSplitter = /^(\w+)\s*(.*)$/,
        MixinComposite = function (parentView, model, ribsUI) {
            this.useCustomRibsUI = typeof(ribsUI) != "undefined";

            this.customInitialize = function () {
                this.mixins = [];
                _.each(mixinClasses, _.bind(function (MixinClass) {
                    var mixin = new MixinClass(parentView, model, ribsUI);
                    _.bind(function () { _.bindAll(this); }, mixin)();
                    mixin.model = model;
                    mixin.ribsUI = ribsUI || (model && model.ribsUI) || new Backbone.Model();
                    this.mixins.push(mixin);
                }, this));
                callAllMixins(this.mixins, "customInitialize", arguments);
            };

            this.bindEvents = function () {
                _.each(this.mixins, function (mixin) {
                    if (!mixin.events && mixin.bindEvents) {
                        mixin.bindEvents.apply(mixin);
                    }
                    if (!mixin || !mixin.events) {
                        return;
                    }
                    _.each(mixin.events, _.bind(function (methodName, key) {
                        var match = key.match(eventSplitter),
                            eventName = match[1], selector = match[2],
                            method = _.bind(this[methodName], this);
                        if (selector === '') {
                          $(mixin.el).bind(eventName, method);
                        } else {
                          $(mixin.el).delegate(selector, eventName, method);
                        }
                    }, mixin));
                });
            };

            this.modelChanged = function (newModel) {
                _.each(this.mixins, function (mixin) {
                    mixin.model = newModel;
                    if (!this.useCustomRibsUI) {
                        mixin.ribsUI = newModel ? newModel.ribsUI : new Backbone.Model();
                    }
                    if (mixin.modelChanged) {
                        mixin.modelChanged.apply(mixin, [newModel]);
                    }
                });
            };

            this.redraw = function (parentEl) {
                this.el = elementSelector ? $(parentEl).find(elementSelector) : $(parentEl);
                _.each(this.mixins, _.bind(function (mixin) {
                    mixin.el = mixin.elementSelector ? this.el.find(mixin.elementSelector) : this.el;
                    if (mixin.redraw) {
                        mixin.redraw.apply(mixin, [parentEl]);
                    }
                }, this));
            };
        };

    _.each(Ribs.mixinMethods, function (methodName) {
        if (!MixinComposite.prototype.hasOwnProperty(methodName)) {
            MixinComposite.prototype[methodName] = function () {
                callAllMixins(this.mixins, methodName, arguments);
            }
        }
    });

    return MixinComposite;
};