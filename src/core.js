var Ribs = {};

Ribs.VERSION = "0.0.90";

/**
 * @field
 * @desc Hash of all mixins visible to the mixin
 * parser. Add your custom ones here.
**/
Ribs.mixins = {};

/**
 * @field
 * @desc Hash of support mixins to use in creation
 * of other mixins.
 */
Ribs.mixinBase = {};

Ribs.enableThrowError = {
    multipleViewsForEl: true,
    modelNotFound: true,
    attributeNotFound: true,
    mixinTypeNotFound: true,
    attributeNameNotDefined: true,
    modelNameNotDefined: true,
    noCompositeMixinFoundForParsing: true
};

Ribs.throwError = function (errorType, msg) {
    if (!Ribs.enableThrowError.hasOwnProperty(errorType) || Ribs.enableThrowError[errorType]) {
        throw errorType + (typeof(msg) !== "undefined" ? ": " + msg : "");
    }
};


