/**
 * @class
 */
Ribs.mixins.support.parent = {
    children: null,
    forEachChild: function (f) {
        _.each(this.children, f);
    }
};