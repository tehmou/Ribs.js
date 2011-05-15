Ribs.mixins.functionValueEdit = function (classOptions) {
    var FunctionValueEditInst = Ribs.mixins.textValueEdit(_.extend({
        readFunctionName: null,
        writeFunctionName: null,

        readFunction: function (value) {
            return (value && value[this.readFunctionName]) ? value[this.readFunctionName]() : value;
        },
        writeFunction: function (value, oldValue) {
            if (oldValue && oldValue[this.writeFunctionName]) {
                oldValue[this.writeFunctionName](value);
                return oldValue;
            }
            return value;
        }
    }, classOptions || {}));

    return FunctionValueEditInst;
};

