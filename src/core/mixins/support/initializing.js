/**
 * @class
 */
Ribs.mixins.support.initializing = {
    initialized: false,
    mixinInitialize: function () {
        if (this.initialized) {
            throw Ribs.throwError("alreadyInitialized");
        }
        this.initialized = true;
    }
};

