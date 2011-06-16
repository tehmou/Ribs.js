Ribs.log = function (msg) {
    if (typeof(console) !== "undefined") {
        console.log(msg);
    }
};

Ribs.utils.addingExtend = function (obj) {
    _.each(Array.prototype.slice.call(arguments, 1), function(source) {
        for (var prop in source) {
            if (_.isFunction(obj[prop])) {
                if (_.isFunction(source[prop])) {
                    (function () {
                        var oldProp = obj[prop],
                            newProp = source[prop];
                        obj[prop] = function () {
                            oldProp.apply(this, arguments);
                            newProp.apply(this, arguments);
                        };
                    }());
                } else {
                    Ribs.throwError("addingExtendFunctionWithNonFunction");
                }
            } else if (_.isArray(obj[prop])) {
                if (_.isArray(source[prop])) {
                    obj[prop] = obj[prop].concat(source[prop]);
                } else {
                    Ribs.throwError("addingExtendArrayWithNonArray");
                }
            } else if (source[prop] !== null) {
                obj[prop] = source[prop];
            }
        }
    });
    return obj;
};

Ribs.utils.findObject = function (obj, path) {
    var splitPath = path.split(".");
    _.each(splitPath, function (elem) {
        if (obj.hasOwnProperty(elem)) {
            obj = obj[elem];
        } else {
            Ribs.throwError("invalidObjectPath", path);
        }
    });
    return obj;
};

