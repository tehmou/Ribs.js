describe("Ribs.mixins.templated", function () {
    var templateString;

    beforeEach(function () {
        templateString = "<div id=\"hello\"><span>My Text</span></div>";
    });

    describe("as a mixin", function () {
        var mixin;

        beforeEach(function () {
            mixin = _.extend({}, Ribs.mixins.templated, {
                templateString: templateString,
                el: $("<div></div>")
            });
            mixin.mixinInitialize();
            mixin.redraw();
        });

        it("Should create templated el inside the given el", function () {
            expect($(mixin.el).attr("id")).toEqual("");
            expect($(mixin.el.children()[0]).attr("id")).toEqual("hello");
            expect($(mixin.el.children()[0]).html()).toEqual("<span>My Text</span>");
        });

        it("Should use json property as the values for the template", function () {
            mixin.json = { qwert: "yuio" };
            mixin.templateFunction = _.template("<span><%= qwert %></span>");
            mixin.redraw();
            expect($(mixin.el).text()).toEqual("yuio");
        });
    });

    describe("redrawing with templates", function () {
        it("Should redraw using the nested templates", function () {
            var mixin = _.extend({}, Ribs.mixins.templated, {
                templateSelector: "#test-tmpl",
                overwriteEl: true
            });
            mixin.mixinInitialize();
            mixin.json = { qwert: "yuio" };
            mixin.redraw();
            expect($(mixin.el.children()[0]).text()).toEqual("yuio");
        });
    });
});