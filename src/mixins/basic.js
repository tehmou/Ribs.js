Ribs.mixins.plainWithModel = _.extend(Ribs.mixinBase.modelful, Ribs.mixinBase.eventful);
Ribs.mixins.plain = Ribs.mixinBase.eventful;
Ribs.mixins.composite = _.extend(Ribs.mixinBase.composite, Ribs.mixinBase.mixinElementResolver);