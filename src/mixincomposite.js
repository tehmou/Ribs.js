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
        getMixinMyValue = function () {
            if (this.attributeName && this.dataModel) {
                return this.dataModel.get(this.attributeName);
            } else if (this.uiAttributeName) {
                return this.uiModel.get(this.uiAttributeName);
            } else {
                return null;
            }
        },
        setMixinMyValue = function (value) {
            var newValues = {};
            if (this.attributeName && this.dataModel) {
                newValues[this.attributeName] = value;
                return this.dataModel.set(newValues);
            } else if (this.uiAttributeName) {
                newValues[this.uiAttributeName] = value;
                return this.uiModel.set(newValues);
            } else {
                return null;
            }
        },
        eventSplitter = /^(\w+)\s*(.*)$/;

    Ribs.mixins.mixinComposite = function (classOptions) {
        classOptions = classOptions || {};

        var mixinClasses = classOptions.mixinClasses,
                elementSelector = classOptions.elementSelector,
                elementCreator = classOptions.elementCreator,

                MixinCompositeInst = function (parentView, model) {
                    this.customInitialize = function () {
                        this.mixins = [];
                        _.each(this.mixinClasses, _.bind(function (MixinClass) {
                            var mixin = new MixinClass(parentView, model);
                            mixin.getMyValue = getMixinMyValue;
                            mixin.setMyValue = setMixinMyValue;
                            _.bind(function () { _.bindAll(this); }, mixin)();
                            mixin.uiModel = (model && model.ribsUI) || new Backbone.Model();
                            if (mixin.modelChanging) {
                                mixin.modelChanging();
                            }
                            mixin.dataModel = model;
                            if (mixin.modelChanged) {
                                mixin.modelChanged(mixin.dataModel);
                            }
                            this.mixins.push(mixin);
                        }, this));
                        callAllMixins(this.mixins, "customInitialize", arguments);
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
                            if (!mixin || !mixin.events || !mixin.el || !mixin.el.is(":visible")) {
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

                    this.modelChanged = function (newModel) {
                        _.each(this.mixins, _.bind(function (mixin) {
                            mixin.dataModel = newModel;
                            mixin.uiModel = newModel ? newModel.ribsUI : new Backbone.Model();
                            if (mixin.modelChanged) {
                                mixin.modelChanged.apply(mixin, [newModel]);
                            }
                        }, this));
                    };

                    this.redraw = function (parentEl) {
                        this.el = $(parentEl).find(elementSelector);
                        if (this.el.length === 0) {
                            if (elementCreator) {
                                this.el = $(parentEl).append($(elementCreator));
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
                };

        MixinCompositeInst.prototype.mixinClasses = mixinClasses;

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

