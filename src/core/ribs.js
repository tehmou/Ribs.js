Ribs.composer = c0mposer.instance({ library: Ribs.mixins });

/**
 * @method
 */
Ribs.compose = _.bind(Ribs.composer.create, Ribs.composer);

Ribs.exportQueue = [];
Ribs.export = function (name, def) {
    Ribs.exportQueue.push({ name: name, def: def });
};

(function () {
    var purgeMixin = function (obj) {
        var path = obj.name.split(".");
        var parent = Ribs.mixins;
        for (var i = 0; i < path.length - 1; i++) {
            if (!parent.hasOwnProperty(path[i])) {
                parent[path[i]] = {};
            }
            parent = parent[path[i]];
        }
        parent[_.last(path)] = Ribs.compose.apply(Ribs, obj.def);
    };

    Ribs.init = function () {
        _.each(Ribs.exportQueue, purgeMixin);
        Ribs.exportQueue = [];
    };
})();

$(function() {
    if (Ribs.autoInit === undefined || Ribs.autoInit) {
        Ribs.init();
    }
});

/**
 * @method
 */
Ribs.view = function (childrenTypes, options) {
    var view = Ribs.compose("pivot", options || {});
    view.mixinDefinitions = childrenTypes;
    return view;
};

