describe("Testing helpers", function () {
    var callStack;

    describe("CallStack", function () {
        beforeEach(function () {
            callStack = new CallStack(); 
        });
    });

    describe("objectCallObserver", function () {
        var object;

        beforeEach(function () {
            object = {
                testFunction1: function () { },
                testFunction2: function () { }
            };
            callStack = objectCallObserver(object);
        });

        it("Should observe calls", function () {

        });

        it("Should observe calls with arguments", function () {

        });

        it("Should throw error when wrong function is called", function () {

        });
    });

    describe("typeCallObserver", function () {
        var Type;

        beforeEach(function () {
            Type = function () {
                this.typeTestFunction1 = function () { };
                this.typeTestFunction2 = function () { };
            };
        });
    });
});