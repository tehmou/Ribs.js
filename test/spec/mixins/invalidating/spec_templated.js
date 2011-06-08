describe("Ribs.mixins.templated", function () {
    var templateString, templateFunction;

    beforeEach(function () {
        templateString = "<div id=\"hello\"><span>My Text</span></div>";
        templateFunction = _.template(templateString);
    });

    it("Should create templated el inside the given el", function () {
        var mixin = _.extend({}, Ribs.mixins.templated, { templateFunction: templateFunction, el: $("<div></div>") });
        mixin.redraw();

        expect(mixin.el.attr("id")).toEqual("");
        expect($(mixin.el.children()[0]).attr("id")).toEqual("hello");
        expect($("span", mixin.el).text()).toEqual("My Text");
    });

    describe("as a pivot", function () {
        var pivot;

        beforeEach(function () {
            pivot = Ribs.mixins.plainPivot;
            pivot.templateFunction = templateFunction;
            pivot.mixinInitialize();
        });

        it("Should create the el based on a template function given", function () {
            expect(pivot.el.attr("id")).toEqual("hello");
            expect($(pivot.el.children()[0]).text()).toEqual("My Text");
        });

        it("Should stay the same after redraw", function () {
            pivot.el.html("");
            pivot.redraw();
            expect(pivot.el.attr("id")).toEqual("hello");
            expect($(pivot.el.children()[0]).text()).toEqual("My Text");
        });
    });
});