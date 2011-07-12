/**
 * @class
 * @requires Ribs.backbone.mixins.support.model.modelBase
 * @requires Ribs.backbone.mixins.support.model.modelAccess
 * @requires Ribs.backbone.mixins.support.model.modelJSON
 */
Ribs.backbone.mixins.support.modelSupport = Ribs.compose(
    "backbone.support.model.modelBase",
    "backbone.support.model.modelAccess",
    "backbone.support.model.modelJSON",
    "backbone.support.model.supportModel"
);

