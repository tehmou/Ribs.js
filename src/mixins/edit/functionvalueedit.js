Ribs.mixins.dateValueEdit = function (classOptions) {
    classOptions = classOptions || {};
    var functionName = classOptions.functionName,
        DateValueEdit = Ribs.mixins.textValueEdit(_.extend(classOptions, {
        readFunction: function (value) {
            return (value && value.getFullYear) ? value.getFullYear() : value;
        },
        writeFunction: function (value, oldValue) {
            if (oldValue && oldValue.setFullYear) {
                oldValue.setFullYear(value);
                return oldValue;
            }
            return value;
        }
    }));

    return DateValueEdit;
};

