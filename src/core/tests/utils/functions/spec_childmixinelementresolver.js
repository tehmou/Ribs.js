describe("Ribs.utils.functions.resolveChildrenElements", function () {
    var mixin, child, el, helloEl, subEl;

    beforeEach(function () {
        mixin = Ribs.compose("support.parent", {
            redraw: Ribs.utils.functions.resolveChildrenElements
        });
        child = {};

        helloEl = $('<div class="hello"></div>');
        subEl = $('<div class="sub"></div>');
        el = $('<div></div>');

        helloEl.append(subEl);
        el.append(helloEl);
        mixin.el = el;
        mixin.children.push(child);
    });

    it("It should consider this.elementSelector", function () {
        mixin.elementSelector = ".hello";
        mixin.redraw();
        expect(child.el.length).toEqual(1);
        expect(child.el[0]).toEqual(helloEl[0]);
    });

    it("It should consider child.elementSelector", function () {
        child.elementSelector = ".hello";
        mixin.redraw();
        expect(child.el.length).toEqual(1);
        expect(child.el[0]).toEqual(helloEl[0]);
    });

    it("It should prioritize this.elementSelector over child.elementSelector", function () {
        mixin.elementSelector = ".hello";
        child.elementSelector = ".sub";
        mixin.redraw();
        expect(child.el.length).toEqual(1);
        expect(child.el[0]).toEqual(subEl[0]);
    });
});