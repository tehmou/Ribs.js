/**
 * @class
 */
Ribs.support.mixins.parent = {
    children: null,
    forEachChild: function (f) {
        _.each(this.children, f);
    }
};