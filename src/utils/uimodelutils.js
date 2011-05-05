Ribs.augmentModelWithUIAttributes = function (model) {
    if (!model.hasOwnProperty("ribsUI")) {
        model.ribsUI = new Backbone.Model();

        // Do this until the next version of Backbone.js:
        // https://github.com/documentcloud/backbone/issues/309
        model.ribsUI.safeUnbind = function (ev, callback) {
            var calls, i, l, emptyFunction = function () { };
            if (!ev) {
                this._callbacks = {};
            } else {
                calls = this._callbacks;
                if (calls) {
                    if (!callback) {
                        calls[ev] = [];
                    } else {
                        var list = calls[ev];
                        if (!list) { return this; }
                        for (i = 0, l = list.length; i < l; i++) {
                            if (callback === list[i]) {
                                list[i] = emptyFunction;
                                break;
                            }
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

Ribs.parseMixinDefinitions = function (mixinDefinitions) {
    mixinDefinitions = mixinDefinitions || [];
    var mixinClasses = [], i, l,
        processMixinDefinition = function (options, name) {
            var mixinFunction = Ribs.mixins[name];
            if (!mixinFunction) {
                throw "Could not find mixin " + name;
            }
            mixinClasses.push(mixinFunction(options));
        };

    if (_.isArray(mixinDefinitions)) {
        for (i = 0, l = mixinDefinitions.length; i < l; i++) {
            var mixinDefinitionObject = mixinDefinitions[i];
            _.each(mixinDefinitionObject, processMixinDefinition);
        }
    } else {
        _.each(mixinDefinitions,
            function (nestedMixinDefinitionArray, elementSelector) {
                var MixinComposite = Ribs.mixins.mixinComposite({
                    mixins: nestedMixinDefinitionArray,
                    elementSelector: elementSelector
                });
                mixinClasses.push(MixinComposite);
            }
        );
    }
    return mixinClasses;
};

Ribs.log = function (msg) {
    if (typeof(console) !== "undefined") {
        console.log(msg);
    }
};