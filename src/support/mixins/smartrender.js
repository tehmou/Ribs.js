Ribs.support.mixins.smartRender = {
    _renderPending: false,

    requestRender: function () {
        if (!this._renderPending) {
            this._renderPending = true;
            _.defer(this.flushRequests);
        }
    },

    requestInvalidate: function () {
        this.invalidated = true;
        this.requestRender();
    },

    flushRequests: function () {
        if (this._renderPending) {
            if (_.isFunction(this.render)) {
                this.render();                
            }
            this._renderPending = false;
        }
    }
};