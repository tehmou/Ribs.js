/*global $,_,console*/

 /**
  * @namespace Ribs.js 0.0.90b
  * 
  * (c) 2011 Timo Tuominen
  * Ribs.js may be freely distributed under the MIT license.
  * For all details and documentation:
  * http://tehmou.github.com/ribs.js
 **/ 




// Default mixin classes

Ribs.mixins.templated = {
    templateSelector: null,
    templateFunction: null,

    mixinInitialize: function () {
        if (!this.templateFunction && this.templateSelector) {
            this.templateFunction = _.template($(this.templateSelector).html());
        }

        if (!this.el && this.templateFunction) {
            this.el = $(this.templateFunction({}));
            this.templateFunction = _.template($(this.el.children()).html());
        }
    },
    redraw: function () {
        var json = {};
        if (_.isFunction(this.getMyModelJSON)) {
            json = this.getMyModelJSON() || json;
        }
        if (this.templateFunction) {
            this.el.html(this.templateFunction(json || {}));
        }
    }
};

Ribs.mixins.plainPivot = _.extend({},
        Ribs.mixins.templated,
        Ribs.mixinBase.renderChain,
        Ribs.mixinBase.selfParsing,
        Ribs.mixins.composite,
        Ribs.mixinBase.pivotEl,
        {
            mixinInitialize: function () {
                // Let the template draw itself first.
                Ribs.mixins.templated.mixinInitialize.apply(this, arguments);

                Ribs.mixinBase.renderChain.mixinInitialize.apply(this, arguments);
                Ribs.mixinBase.selfParsing.mixinInitialize.apply(this, arguments);
                Ribs.mixins.composite.mixinInitialize.apply(this, arguments);
                Ribs.mixinBase.pivotEl.mixinInitialize.apply(this, arguments);
            },

            redraw: function () {
                Ribs.mixins.templated.redraw.apply(this, arguments);
                Ribs.mixins.composite.redraw.apply(this, arguments);
            }
        }
    );

