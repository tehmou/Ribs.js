(function () {

    Ribs.mixinBase = {};

    Ribs.mixinBase.modelBinding = {
        getMyValue: function () {
            return this.model && this.model.get(this.attributeName);
        },
        setMyValue: function (value) {
            if (this.model && this.attributeName) {
                var newValues = {};
                newValues[this.attributeName] = value;
                this.model.set(newValues);
                return true;
            }
            return false;
        },
        updateModel: function () {
            if (this.parent && this.parent.ribsUIModels) {
                var model = this.parent.ribsUIModels.get(this.modelName);
                if (this.model !== model) {
                    if (typeof(this.bindToModel) === "function") {
                        this.bindToModel(model);
                    }
                    this.model = model;
                }
            }
        }
    };

    var eventSplitter = /^(\w+)\s*(.*)$/;
    Ribs.mixinBase.eventful = {
        unbindEvents: function () {
            if (this.el) {
                this.el.unbind();
            }
        },
        bindEvents: function () {
            if (!this.events || !this.el) {
                return;
            }
            _.each(this.events, _.bind(function (methodName, key) {
                var match = key.match(eventSplitter),
                        eventName = match[1], selector = match[2],
                        method = _.bind(this[methodName], this);
                if (selector === '') {
                    this.el.bind(eventName, method);
                } else {
                    this.el.delegate(selector, eventName, method);
                }
            }, this));
        }

    };

    Ribs.mixinBase.plain = Ribs.mixinBase.eventful;
    Ribs.mixinBase.withModel = _.extend(Ribs.mixinBase.modelBinding, Ribs.mixinBase.eventful);
    
}());