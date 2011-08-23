Ribs.composer = c0mposer.instance({ library: Ribs.mixins });

/**
 * @method
 */
Ribs.compose = _.bind(Ribs.composer.create, Ribs.composer);

(function () {
    var initialized = false;
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

    Ribs.exportMixinQueue = [];
    Ribs.exportMixin = function (name, def) {
        if (!initialized) {
            Ribs.exportMixinQueue.push({ name: name, def: def });
        } else {
            purgeMixin({ name: name, def: def });
        }
    };

    Ribs.init = function () {
        _.each(Ribs.exportMixinQueue, purgeMixin);
        Ribs.exportMixinQueue = [];
        initialized = true;
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

