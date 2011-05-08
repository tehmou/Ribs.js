Ribs.mixins.functionValueEdit = function (classOptions) {
    classOptions = classOptions || {};
    var readFunctionName = classOptions.readFunctionName,
        writeFunctionName = classOptions.writeFunctionName,
    
        FunctionValueEditInst = Ribs.mixins.textValueEdit(_.extend(classOptions, {
            readFunction: function (value) {
                return (value && value[readFunctionName]) ? value[readFunctionName]() : value;
            },
            writeFunction: function (value, oldValue) {
                if (oldValue && oldValue[writeFunctionName]) {
                    oldValue[writeFunctionName](value);
                    return oldValue;
                }
                return value;
            }
        }));

    return FunctionValueEditInst;
};

