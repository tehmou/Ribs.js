Ribs.composer = c0mposer.instance({ library: Ribs.mixins });

/**
 * @method
 */
Ribs.compose = _.bind(Ribs.composer.create, Ribs.composer);

/**
 * @method
 */
Ribs.view = function (childrenTypes, options) {
    var view = Ribs.compose("pivot", options || {});
    view.mixinDefinitions = childrenTypes;
    return view;
};

