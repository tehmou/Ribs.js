Ribs.mixins.plainWithModel = _.extend({}, Ribs.mixinBase.modelful, Ribs.mixinBase.eventful);
Ribs.mixins.plain = Ribs.mixinBase.eventful;
Ribs.mixins.plainPivot = _.extend({},
        Ribs.mixins.composite,
        Ribs.mixinBase.renderChain,
        Ribs.mixinBase.pivotEl,
        Ribs.mixinBase.selfParsing,
        {
            mixinInitialize: function () {
                Ribs.mixinBase.renderChain.mixinInitialize.apply(this, arguments);
                Ribs.mixinBase.pivotEl.mixinInitialize.apply(this, arguments);
                Ribs.mixins.composite.mixinInitialize.apply(this, arguments);
                Ribs.mixinBase.selfParsing.mixinInitialize.apply(this, arguments);
            }
        }
    );
Ribs.mixins.composite = _.extend({}, Ribs.mixins.composite, Ribs.mixinBase.childMixinElementResolver);