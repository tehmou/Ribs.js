describe("Ribs.utils.modelresolving", function () {
    var mixin, json;

    beforeEach(function () {
        json = {};
        mixin = _.extend({
            valueAttributeName: "test",
            valueModelName: "dataModel",
            jsonModelName: "dataModel",
            pivot: {
                getValue: function (options) {
                    if (options.modelName !== "dataModel") {
                        throw "Wrong model name requested";
                    }
                    if (options.attributeName !== "test") {
                        throw "Wrong attribute name requested";
                    }
                    return "returnValue";
                },
                getModelJSON: function (options) {
                    if (options.modelName !== "dataModel") {
                        throw "Wrong model name requested";
                    }
                    return json;
                }
            }
        });
    });

    it("Should resolve value from the given model/attribute name", function () {
        Ribs.utils.resolveValue.apply(mixin);
        expect(mixin.value).toEqual("returnValue");
    });

    it("Should resolve json from the given model/attribute name", function () {
        Ribs.support.functions.resolveJSON.apply(mixin);
        expect(mixin.json).toEqual(json);
    });
});