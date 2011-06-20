describe("jquery.ribs.js", function () {
    var el, def;

    beforeEach(function () {
        el = $("<div></div>");
        def = { pivot: {
            mixinDefinitions: [
                { simpleList: {
                    myModelName: "data",
                    itemRenderer:
                        { pivot: [
                            Ribs.mixins.templated,
                            {
                                overwriteEl: true,
                                templateSelector: "#my-template"
                            }
                        ]}
                }}
            ]
        }};
    });

    if ("Should create a component based on definition", function () {
        $(el).ribs("createView", def);
    });
});