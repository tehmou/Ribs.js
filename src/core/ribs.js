/**
 * @method
 */
Ribs.view = function (childrenTypes) {
    var view = Ribs.compose("pivot");
    view.mixinDefinitions = childrenTypes;
    return view;
};

