Ribs.log = function (msg) {
    if (typeof(console) !== "undefined") {
        console.log(msg);
    }
};

Ribs.addingExtend = function (obj) {
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
                    throw "Tried to override a function with non-function";
                }
            } else {
                obj[prop] = source[prop];
            }
        }
    });
    return obj;
};