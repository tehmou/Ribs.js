$(function () {

    var fruitsCollection, alphabets = {}, alphabetsCollection,
        fruitDetailsView,
        generateAlphabets = function () {
            alphabetsCollection = new Backbone.Collection();
            for (var i = 0; i < 26; i++) {
                var alphabet = String.fromCharCode(65 + i),
                    alphabetModel = new Backbone.Model({
                        alphabet: alphabet,
                        fruits: new Backbone.Collection()
                    });
                alphabets[alphabet] = alphabetModel;
                alphabetsCollection.add(alphabetModel);
            }
        },
        generateFruits = function (data) {
            fruitsCollection = new Backbone.Collection();
            _.each(data, function (fruitName) {
                var fruit = new Backbone.Model({
                    name: fruitName,
                    available: Math.random() < 0.7,
                    price: Math.floor(Math.random() * 20)
                });
                fruitsCollection.add(fruit);
                if (alphabets.hasOwnProperty(fruitName.substr(0, 1))) {
                    alphabets[fruitName.substr(0, 1)].get("fruits").add(fruit);
                }
            });
        },
        initialize = function () {
            var FruitItem = Ribs.createMixed({
                   mixinClasses: [
                       Ribs.mixins.Templated({
                           templateFunction: _.template($("#fruit-item-tmpl").html()),
                           tagClass: "fruit-item"
                       }),
                       Ribs.mixins.Hoverable({}),
                       Ribs.mixins.Selectable({})
                   ]
                }),
                FruitDetails = Ribs.createMixed({
                    requireModel: false,
                    mixinClasses: [
                        Ribs.mixins.Templated({
                            templateFunction: _.template($("#fruit-details-tmpl").html())
                        })
                    ]
                }),
                PlainList = Ribs.createMixed({
                    mixinClasses: [
                        Ribs.mixins.Templated({
                           templateFunction: _.template($("#plain-list-tmpl").html())
                        }),
                        Ribs.mixins.SimpleList({
                            elementSelector: ".list",
                            ItemRenderer: FruitItem
                        })
                    ]
                }),
                AlphabetItem = Ribs.createMixed({
                    mixinClasses: [
                        Ribs.mixins.Templated({
                            templateFunction: _.template($("#alphabet-item-tmpl").html()),
                            tagClass: "alphabet-item"
                        }),
                        Ribs.mixins.ToggleableElement({ elementSelector: ".nested-fruit-list:first" }),
                        Ribs.mixins.SimpleList({
                            elementSelector: ".nested-fruit-list:first",
                            ItemRenderer: FruitItem,
                            listAttributeName: "fruits"
                        }),
                        Ribs.mixins.Hoverable({ elementSelector: ".item-body:first" }),
                        Ribs.mixins.Hoverable({ elementSelector: ".folder-icon:first" }),
                        Ribs.mixins.Toggleable({ elementSelector: ".item-body:first" }),
                        Ribs.mixins.Toggleable({ elementSelector: ".folder-icon:first", usePlusMinus: true })
                    ]
                }),
                AlphabetList = Ribs.createMixed({
                    mixinClasses: [
                        Ribs.mixins.Templated({
                            templateFunction: _.template($("#alphabet-list-tmpl").html())
                        }),
                        Ribs.mixins.SimpleList({
                            elementSelector: ".list",
                            ItemRenderer: AlphabetItem
                        })
                    ]
                });

            Ribs.createUIManager("main", { allowMultiselect: false });
            Ribs.uiManagers.main.register(fruitsCollection);
            Ribs.uiManagers.main.register(alphabetsCollection);
            Ribs.uiManagers.main.getViewModel().bind("change:nowSelected", function (item) {
                var nowSelected = item && item.get("nowSelected"),
                    owner = nowSelected ? nowSelected.get("owner") : null;
                fruitDetailsView.bindToModel(owner);
                fruitDetailsView.render();
            });


            fruitDetailsView = new FruitDetails({ el: $("#fruit-details") });
            new PlainList({ model: fruitsCollection, el: $("#fruit-list")});
            new AlphabetList({ model: alphabetsCollection, el: $("#alphabet-list")});
        };

    generateAlphabets();
    generateFruits(fruitData);
    initialize();
    
});