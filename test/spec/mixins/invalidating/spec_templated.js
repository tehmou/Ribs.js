describe("Ribs.mixins.templated", function () {
    var pivot, mixin, templateString, templateFunction;

    beforeEach(function () {
        templateString = "<span>My Text</span>";
        templateFunction = _.template(templateString);

        pivot = Ribs.mixins.plainPivot;
        pivot.mixinDefinitions = [{ templated: { templateFunction: templateFunction }}];
        pivot.mixinInitialize();
        mixin = pivot.mixins[0];
    });

    it("Should create an element based on a template function given", function () {
        console.log(pivot.el);
        expect(false).toBeTruthy();
    });
});