/**
 * @method
 * @desc Combines a number of mixins and takes care of them.
 * This includes delegating methods and managing some syntax mixins use.
 *
 * @param classOptions Object parameter.
 * @param classOptions.elementSelector jQuery selector that is
 * invoked on the DOM element of the View that this mixin belongs to.
 * @param classOptions.mixinClasses Array of plain preinitialized mixins.
 * No parsing will occur for these. Overrides classOptions.mixins.
 * @param classOptions.mixins Array or Object of mixins with the Ribs.js
 * mixin notation. See samples for how this works.
 * @param classOptions.attributeName Name of the data attribute associated to this
 * mixin. It is retrieved from the original data model. If a mixin declares this
 * property, the value is inserted into "myValue" property of this mixin.
 * @param classOptions.uiAttributeName Name of the UI attribute that this mixin uses.
 * The corresponding value is taken from the ribsUI property of the
 * original model.If a mixin declares this property, the value is inserted
 * into "myValue" property of this mixin.
 */
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
            if (mixin.attributeName && mixin.dataModel) {
                mixin.myValue = mixin.dataModel.get(mixin.attributeName);
            } else if (mixin.uiAttributeName) {
                mixin.myValue = mixin.uiModel.get(mixin.uiAttributeName);
            } else {
                mixin.myValue = null;
            }
        },
        eventSplitter = /^(\w+)\s*(.*)$/,

        MixinCompositeInst = function (parentView, model) {
            this.customInitialize = function () {
                this.mixins = [];
                _.each(mixinClasses, _.bind(function (MixinClass) {
                    var mixin = new MixinClass(parentView, model);
                    _.bind(function () { _.bindAll(this); }, mixin)();
                    mixin.uiModel = (model && model.ribsUI) || new Backbone.Model();
                    if (mixin.modelChanging) {
                        mixin.modelChanging();
                    }
                    mixin.dataModel = model;
                    updateMixinMyValue(mixin);
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
                    updateMixinMyValue(mixin);
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
                    updateMixinMyValue(mixin);
                    updateMixinEl(mixin, this.el);
                    if (mixin.redraw) {
                        mixin.redraw.apply(mixin, [mixin.el]);
                    }
                }, this));
            };

            this.refresh = function () {
                _.each(this.mixins, _.bind(function (mixin) {
                    updateMixinMyValue(mixin);
                    if (mixin.refresh) {
                        mixin.refresh.apply(mixin);
                    }
                }, this));
            };
        };

    _.each(Ribs.mixinMethods, function (methodName) {
        if (!MixinCompositeInst.prototype.hasOwnProperty(methodName)) {
            MixinCompositeInst.prototype[methodName] = function () {
                callAllMixins(this.mixins, methodName, arguments);
            };
        }
    });

    return MixinCompositeInst;
};