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

Ribs.mixins.plainPivot = Ribs.addingExtend({},
        Ribs.mixins.templated,
        Ribs.support.mixins.renderChain,
        Ribs.support.mixins.selfParsing,
        Ribs.mixins.composite,
        Ribs.support.mixins.pivotEl
    );

Ribs.mixins.simpleList = {
    redraw: function () {

    }
};