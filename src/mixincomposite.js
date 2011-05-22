(function () {

    var callAllMixins = function (mixins, methodName, originalArguments) {
            _.each(mixins, function (mixin) {
                if (mixin[methodName]) {
                    mixin[methodName].apply(mixin, originalArguments);
                }
            });
        },
        updateMixinEl = function (mixin, el) {
            mixin.el = mixin.elementSelector ? el.find(mixin.elementSelector) : el;
        },
        updateMixinModel = function (mixin) {
            if (mixin.parent && mixin.parent.ribsUIModels) {
                var model = mixin.parent.ribsUIModels.get(mixin.modelName);
                if (mixin.model !== model) {
                    if (typeof(mixin.bindToModel) === "function") {
                        mixin.bindToModel(model);
                    }
                    mixin.model = model;
                }
            }
        },
        eventSplitter = /^(\w+)\s*(.*)$/;

    Ribs.mixins.mixinComposite = function (classOptions) {
        classOptions = classOptions || {};

        var MixinCompositeInst = function (parentView, model) {

                this.customInitialize = function () {
                    if (parentView) {
                        parentView.bind("change", this.updateMixinModels);
                    }
                    this.mixins = [];
                    _.each(this.mixinClasses, _.bind(function (MixinClass) {
                        var mixin = new MixinClass(parentView, model), that = this;
                        _.bind(function () { _.bindAll(this); }, mixin)();

                        mixin.parent = parentView;
                        _.each(Ribs.inheritingMixinProperties, function (property) {
                            mixin[property] = mixin[property] || that[property];
                        });
                        updateMixinModel(mixin);

                        this.mixins.push(mixin);
                    }, this));
                    callAllMixins(this.mixins, "customInitialize", arguments);
                };

                this.bindToModel = function () {
                    this.updateMixinModels();
                };

                this.updateMixinModels = function () {
                    _.each(this.mixins, function (mixin) {
                        updateMixinModel(mixin);
                    });
                };

                this.unbindEvents = function () {
                    if (this.el) {
                        this.el.unbind();
                    }
                    _.each(this.mixins, function (mixin) {
                        if (mixin.el) {
                            mixin.el.unbind();
                        }
                        if (mixin.unbindEvents) {
                            mixin.unbindEvents.apply(mixin);
                        }
                    });
                };

                this.bindEvents = function () {
                    _.each(this.mixins, function (mixin) {
                        if (mixin.bindEvents) {
                            mixin.bindEvents.apply(mixin);
                        }
                        if (!mixin || !mixin.events || !mixin.el) {
                            return;
                        }
                        _.each(mixin.events, _.bind(function (methodName, key) {
                            var match = key.match(eventSplitter),
                                    eventName = match[1], selector = match[2],
                                    method = _.bind(this[methodName], this);
                            if (selector === '') {
                                mixin.el.bind(eventName, method);
                            } else {
                                mixin.el.delegate(selector, eventName, method);
                            }
                        }, mixin));
                    });
                };

                this.redraw = function (parentEl) {
                    this.el = $(parentEl).find(this.elementSelector);
                    if (this.el.length === 0) {
                        if (this.elementCreator) {
                            this.el = $(parentEl).append($(this.elementCreator));
                        } else {
                            this.el = $(parentEl);
                        }
                    }
                    _.each(this.mixins, _.bind(function (mixin) {
                        updateMixinEl(mixin, this.el);
                        if (mixin.redraw) {
                            mixin.redraw.apply(mixin, [mixin.el]);
                        }
                    }, this));
                };

                _.extend(this, classOptions);
            };

        MixinCompositeInst.prototype.mixinClasses = classOptions.mixinClasses;

        _.each(Ribs.mixinMethods, function (methodName) {
            if (!MixinCompositeInst.prototype.hasOwnProperty(methodName)) {
                MixinCompositeInst.prototype[methodName] = function () {
                    callAllMixins(this.mixins, methodName, arguments);
                };
            }
        });

        return MixinCompositeInst;
    };
}());

