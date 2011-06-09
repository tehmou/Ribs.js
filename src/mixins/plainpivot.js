Ribs.mixins.plainPivot = _.extend({},
        Ribs.mixins.templated,
        Ribs.mixinBase.renderChain,
        Ribs.mixinBase.selfParsing,
        Ribs.mixins.composite,
        Ribs.mixinBase.pivotEl,
        {
            mixinInitialize: function () {
                // Let the template draw itself first.
                Ribs.mixins.templated.mixinInitialize.apply(this, arguments);

                Ribs.mixinBase.renderChain.mixinInitialize.apply(this, arguments);
                Ribs.mixinBase.selfParsing.mixinInitialize.apply(this, arguments);
                Ribs.mixins.composite.mixinInitialize.apply(this, arguments);
                Ribs.mixinBase.pivotEl.mixinInitialize.apply(this, arguments);
            },

            redraw: function () {
                Ribs.mixins.templated.redraw.apply(this, arguments);
                Ribs.mixins.composite.redraw.apply(this, arguments);
            }
        }
    );

