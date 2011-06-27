describe("jquery.ribs.js", function () {
    var el, def;

    beforeEach(function () {
        el = $("<div></div>");
        def = [];
    });

    it("Should create a component based on definition", function () {
        $(el).ribs("createView", def);
        expect($(el)[0].ribsView).toBeDefined();
    });

    it("Should consider the third arguments as options", function () {
        $(el).ribs("createView", def, { myValue: "foo" });
        expect($(el)[0].ribsView.myValue).toEqual("foo");
    });
});