(function(){
    var Thighbone;

    Thighbone = this.Thighbone = {};

    Thighbone.VERSION = '0.0.1';

    Thighbone.mixins = {};

    Thighbone.augmentModelWithUIAttributes = function (model) {
        if (!model.hasOwnProperty("thighboneUI")) {
            model.thighboneUI = new Backbone.Model();
            model.thighboneUI.set({ owner: model });
            model.thighboneUI.bind("all", function (event) {
                model.trigger("thighboneUI:" + event, Array.prototype.slice.call(arguments, 1));
            });
        }
    };

    Thighbone.ManagedView = Backbone.View.extend({
        invalidated: true,
        refreshOnlyIfVisible: false,

        initialize: function () {
            _.bindAll(this, "customInitialize", "render", "redraw", "refresh", "hide", "dispose");
            Backbone.View.prototype.initialize.apply(this, arguments);
            this.model && this.bindToModel(this.model);
            this.customInitialize();
            this.render();
        },
        customInitialize: function () { },
        bindToModel: function (model) {
            this.model && this.model.thighboneUI && this.model.thighboneUI.unbind("all", this.render);
            this.model = model;
            if (this.model) {
                Thighbone.augmentModelWithUIAttributes(this.model);
                this.model.thighboneUI.bind("all", this.render);
            }
            this.modelChanged();
            this.render();
        },
        modelChanged: function () { },
        render: function () {
            if (this.invalidated) {
                this.redraw();
            }
            if (!this.refreshOnlyIfVisible || $(this.el).is(":visible")) {
                this.refresh();
            }
        },
        redraw: function () { },
        refresh: function () { },
        hide: function () {
            $(this.el).detach();
        },
        dispose: function () {
            $(this.el).remove();
        }
    });

    Thighbone.createMixed = function (myOptions) {
        myOptions = myOptions || {};

        var requireModel = myOptions.hasOwnProperty("requireModel") ? myOptions.requireModel : true,
            mixinClasses = myOptions.mixinClasses,
            Buildee = Thighbone.ManagedView.extend(),
            delegateOneToMixins = function (methodName) {
                Buildee.prototype[methodName] = function () {
                    var doIt = function () {
                        Thighbone.ManagedView.prototype[methodName].apply(this, arguments);
                        _.each(this.mixins, _.bind(function (mixin) {
                            mixin[methodName] && mixin[methodName].apply(this, arguments);
                        }, this));
                    }

                    if (this.entryPoint) {
                        this.entryPoint.apply(this, [doIt].concat(arguments));
                    } else {
                        doIt.apply(this, arguments);
                    }
                }
            },
            delegateToMixins = function (methods) {
                _.each(methods, function (methodName) { delegateOneToMixins(methodName); });
            };

        Buildee.prototype.initialize = function () {
            if (requireModel && !this.model) {
                throw "No model specified and requireModel==true";
            }
            this.mixins = [];
            _.each(mixinClasses, _.bind(function (Mixin) {
                this.mixins.push(new Mixin(this.options));
            }, this));
            Thighbone.ManagedView.prototype.initialize.apply(this, arguments);
        };

        delegateToMixins(["customInitialize", "modelChanged", "render", "redraw", "refresh", "hide", "dispose"]);

        return Buildee;
    };

})();