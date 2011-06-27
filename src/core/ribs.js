/**
 * @method
 */
Ribs.view = function () {
    arguments = _.toArray(arguments);
    arguments.splice(0, 0, "pivot");
    var view = Ribs.compose.apply(null, arguments);
    return view;
};

