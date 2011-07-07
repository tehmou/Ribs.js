/**
 * @class
 * @requires Ribs.backbone.mixins.support.modelBase
 * @requires Ribs.backbone.mixins.support.modelAccess
 * @requires Ribs.backbone.mixins.support.modelJSON
 */
Ribs.backbone.mixins.support.modelSupport = Ribs.compose(
    "backbone.support.modelBase",
    "backbone.support.modelAccess",
    "backbone.support.modelJSON",
    "backbone.support.supportModel"
);

