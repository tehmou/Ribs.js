describe("Ribs.mixins.templated", function () {
    var templateString, templateFunction;

    beforeEach(function () {
        templateString = "<div id=\"hello\"><span>My Text</span></div>";
        templateFunction = _.template(templateString);
    });

    describe("as a mixin", function () {
        var mixin;

        beforeEach(function () {
            mixin = _.extend({}, Ribs.mixins.templated, { templateFunction: templateFunction, el: $("<div></div>") });
            mixin.mixinInitialize();
            mixin.redraw();
        });

        it("Should create templated el inside the given el", function () {
            expect(mixin.el.attr("id")).toEqual("");
            expect($(mixin.el.children()[0]).attr("id")).toEqual("hello");
            expect($(mixin.el.children()[0]).html()).toEqual("<span>My Text</span>");
        });
    });

    describe("as a pivot", function () {
        var pivot;

        beforeEach(function () {
            pivot = _.extend({}, Ribs.mixins.plainPivot);
            pivot.templateFunction = templateFunction;
            pivot.mixinInitialize();
        });

        it("Should create the el based on a template function given", function () {
            expect(pivot.el.attr("id")).toEqual("hello");
            expect($(pivot.el).html()).toEqual("<span>My Text</span>");
        });

        it("Should stay the same after redraw", function () {
            pivot.el.html("");
            pivot.redraw();
            expect(pivot.el.attr("id")).toEqual("hello");
            expect($(pivot.el).html()).toEqual("<span>My Text</span>");
            console.log(pivot.el);
        });
    });
});