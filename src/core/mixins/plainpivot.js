/**
 * @class
 */
Ribs.mixins.plainPivot = Ribs.utils.compose(
        Ribs.support.mixins.parent,
        Ribs.support.mixins.renderChain,
        Ribs.support.mixins.hideable,
        Ribs.support.mixins.disposeable,
        Ribs.support.mixins.deferredRender,
        Ribs.support.mixins.selfParsing,
        Ribs.support.mixins.element,
        {
            render: function () {
                this.delegateToChildren("render", arguments);
            }
        }
    );

