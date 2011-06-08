Ribs.mixins.plain = Ribs.mixinBase.eventful;
Ribs.mixins.plainWithModel = _.extend({},
        Ribs.mixins.plain,
        Ribs.mixinBase.modelful,
        {
            mixinInitialize: function () {
                Ribs.mixins.plain.mixinInitialize.apply(this, arguments);
                Ribs.mixinBase.modelful.mixinInitialize.apply(this, arguments);
            }
        });
Ribs.mixins.composite = _.extend({},
        Ribs.mixinBase.compositeBase,
        Ribs.mixinBase.childMixinElementResolver,
        {
            mixinInitialize: function () {
                Ribs.mixinBase.compositeBase.mixinInitialize.apply(this, arguments);
                Ribs.mixinBase.childMixinElementResolver.mixinInitialize(this, arguments);
            }
        });

