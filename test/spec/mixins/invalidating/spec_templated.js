describe("Ribs.mixins.templated", function () {
    var pivot, mixin, templateString, templateFunction;

    beforeEach(function () {
        templateString = "<div id=\"hello\"><span>My Text</span></div>";

        pivot = Ribs.mixins.plainPivot;
        pivot.templateFunction =_.template(templateString);
        pivot.mixinDefinitions = [{ templated: { templateFunction: templateFunction }}];
        pivot.mixinInitialize();
        mixin = pivot.mixins[0];
    });

    it("Should create an element based on a template function given", function () {
        console.log(pivot.el);
    });
});