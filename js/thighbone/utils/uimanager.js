Thighbone.createUIManager = function (key, myOptions) {
    myOptions = myOptions || {};

    Thighbone.uiManagers = Thighbone.uiManagers || {};

    Thighbone.uiManagers[key] = function () {
        var allowMultiselect = myOptions.allowMultiselect,
            nowHovering, nowSelected,
            hoveringChanged = function (event) {
                var item = event[0];
                if (item !== nowHovering && item.get("hovering")) {
                    nowHovering && nowHovering.set({ hovering: false });
                    nowHovering = item;
                }
            },
            selectedChanged = function (event) {
                var item = event[0];
                if (item !== nowSelected && item.get("selected")) {
                    if (!allowMultiselect) {
                        nowSelected && nowSelected.set({ selected: false });
                    }
                    nowSelected = item;
                }
            },
            register = function (model) {
                if (model) {
                    unregister(model);
                    model.bind("thighboneUI:change:hovering", hoveringChanged);
                    model.bind("thighboneUI:change:selected", selectedChanged);
                }
            },
            unregister = function (model) {
                if (model) {
                    model.unbind("thighboneUI:change:hovering", hoveringChanged);
                    model.unbind("thighboneUI:change:selected", selectedChanged);
                }
            };

        return {
            register: register,
            unregister: unregister
        }
    }();       
};