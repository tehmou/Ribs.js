Ribs.mixins.mixinComposite = function (classOptions) {
    classOptions = classOptions || {};
    var mixinClasses = classOptions.mixinClasses || [];

    if (classOptions.mixinClasses) {
        delete classOptions.mixinClasses;
    }

    var MixinComposite = function (instanceOptions) {
            instanceOptions = instanceOptions || {};
            var mixinOptions = _.extend(classOptions, instanceOptions);
            this.mixins = [];
            _.each(mixinClasses, _.bind(function (MixinClass) {
                var mixin = new MixinClass(mixinOptions);
                this.mixins.push(mixin);
            }, this));
        },
        callAllMixins = function (mixins, methodName, originalArguments) {
            _.each(mixins, function (mixin) {
                if (mixin[methodName]) {
                    mixin[methodName].apply(mixin, originalArguments);
                }
            });
        },
        eventSplitter = /^(\w+)\s*(.*)$/,
        bindMixinEvents = function (mixin) {
            if (!mixin || !mixin.events) { return; }

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
        };;

    MixinComposite.prototype.bindEvents = function () {
        callAllMixins(this.mixins, "bindEvents", arguments);
        var eventSplitter = /^(\w+)\s*(.*)$/;

    };

    MixinComposite.prototype.modelChanged = function () {
        callAllMixins(this.mixins, "modelChanged", arguments);
    };

    MixinComposite.prototype.redraw = function () {
        callAllMixins(this.mixins, "redraw", arguments);
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