Ribs.mixins.mixinComposite = function (classOptions) {
    classOptions = classOptions || {};

    var elementSelector = classOptions.elementSelector,
        elementCreator = classOptions.elementCreator,
        mixinClasses = classOptions.mixinClasses || Ribs.parseMixinDefinitions(classOptions.mixins),
        callAllMixins = function (mixins, methodName, originalArguments) {
            _.each(mixins, function (mixin) {
                if (mixin[methodName]) {
                    mixin[methodName].apply(mixin, originalArguments);
                }
            });
        },
        updateMixinEl = function (mixin, el) {
            mixin.el = mixin.elementSelector ? el.find(mixin.elementSelector) : el;
        },
        updateMixinMyValue = function (mixin) {
            if (mixin.attributeName && mixin.model) {
                mixin.myValue = mixin.model.get(mixin.attributeName);
            } else if (mixin.uiAttributeName) {
                mixin.myValue = mixin.ribsUI.get(mixin.uiAttributeName);
            } else {
                mixin.myValue = null;
            }
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
                    updateMixinMyValue(mixin);
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
                        mixin.unbindEvents();
                    }
                });
            };

            this.bindEvents = function () {
                _.each(this.mixins, function (mixin) {
                    if (!mixin.events && mixin.bindEvents) {
                        mixin.bindEvents();
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

            this.modelChanged = function (newModel) {
                _.each(this.mixins, function (mixin) {
                    mixin.model = newModel;
                    if (!this.useCustomRibsUI) {
                        mixin.ribsUI = newModel ? newModel.ribsUI : new Backbone.Model();
                    }
                    updateMixinMyValue(mixin);
                    if (mixin.modelChanged) {
                        mixin.modelChanged(newModel);
                    }
                });
            };

            this.redraw = function (parentEl) {
                this.el = $(parentEl).find(elementSelector);
                if (this.el.length == 0) {
                    if (elementCreator) {
                        this.el = $(parentEl).append($(elementCreator));
                    } else {
                        this.el = parentEl;
                    }
                }
                _.each(this.mixins, _.bind(function (mixin) {
                    updateMixinMyValue(mixin);
                    updateMixinEl(mixin, this.el);
                    if (mixin.redraw) {
                        mixin.redraw(mixin.el);
                    }
                }, this));
            };

            this.refresh = function () {
                _.each(this.mixins, _.bind(function (mixin) {
                    updateMixinMyValue(mixin);
                    if (mixin.refresh) {
                        mixin.refresh();
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