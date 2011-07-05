/**
 * @method
 */
Ribs.view = function (childrenTypes, options) {
    var view = Ribs.compose("pivot", options || {});
    view.mixinDefinitions = childrenTypes;
    return view;
};

