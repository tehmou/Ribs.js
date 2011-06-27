/**
 * @class
 */
Ribs.mixins.support.initializing = {
    initialized: false,
    mixinInitialize: function () {
        if (this.initialized) {
            throw Ribs.error("alreadyInitialized");
        }
        this.initialized = true;
    }
};

