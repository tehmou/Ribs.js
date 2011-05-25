/**
 * @method
 * @desc Creates a manager to which Backbone Collections
 * can be added. The manager will listen to ribsUI:change:selected
 * and ribsUI:change:hovering events, and make sure only one
 * item is selected/hovering at a time.<br &><br />
 *
 * The selected/hovering item can be accessed through the
 * viewModel that this manager internally uses to keep track of
 * what is selected/hovering.
 *
 * @param key Identifier for this UI manager. The created
 * UI manager can be accessed through Ribs.uiManager.<key>.
 * @param myOptions Do not use for now.
 */
Ribs.createUIManager = function (key, myOptions) {
    myOptions = myOptions || {};

    Ribs.uiManagers = Ribs.uiManagers || {};

    Ribs.uiManagers[key] = (function () {
        var allowMultiselect = myOptions.allowMultiselect,
            viewModel = new Backbone.Model({ nowHovering: null, nowSelected: null }),
            hoveringChanged = function (event) {
                var item = event[0];
                if (item === viewModel.get("nowHovering") && !item.get("hovering")) {
                    viewModel.set({ nowHovering: null });
                } else if (item !== viewModel.get("nowHovering") && item.get("hovering")) {
                    var lastHovering = viewModel.get("nowHovering");
                    viewModel.set({ nowHovering: item });
                    if (lastHovering) {
                        lastHovering.set({ hovering: false });
                    }
                }
            },
            selectedChanged = function (event) {
                var item = event[0];
                if (item === viewModel.get("nowSelected") && !item.get("selected")) {
                    viewModel.set({ nowSelected: null });
                } else if (item !== viewModel.get("nowSelected") && item.get("selected")) {
                    var lastSelected = viewModel.get("nowSelected");
                    viewModel.set({ nowSelected: item });
                    if (!allowMultiselect && lastSelected) {
                         lastSelected.set({ selected: false });
                    }
                }
            },
            unregister = function (model) {
                if (model) {
                    model.unbind("ribsUI:change:hovering", hoveringChanged);
                    model.unbind("ribsUI:change:selected", selectedChanged);
                }
            },
            register = function (model) {
                if (model) {
                    unregister(model);
                    model.bind("ribsUI:change:hovering", hoveringChanged);
                    model.bind("ribsUI:change:selected", selectedChanged);
                }
            };

        return {
            /**
             * @method
             * @desc Registers the given Backbone Model/Collection to be
             * managed by this manager.
             *
             * @param The Model or Collection wanted to be managed.
             */
            register: register,

            /**
             * @method
             * @desc Stops managing the given Model/Collection.
             *
             * @param The Model or Collection wanted to be unregistered.
             */
            unregister: unregister,

            /**
             * @method
             * @desc Returns the viewModel that contains the state of
             * this manager.
             */
            getViewModel: function () { return viewModel; }
        };
    }());
};

