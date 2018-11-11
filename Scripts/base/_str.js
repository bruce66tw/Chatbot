
var _str = {

    //欄位分隔符號
    colSep: '@@',

    //variables is empty or not
    isEmpty: function (data) {
        return (data === undefined || data == null || data == '')
    },

    //format string like c# String.Format()
    format: function () {
        var str = arguments[0];
        for (var i = 0; i < arguments.length - 1; i++) {
            var reg = new RegExp("\\{" + i + "\\}", "gm");
            str = str.replace(reg, arguments[i + 1]);
        }
        return str;
    },

    //傳回切除首尾的字串
    getCut2: function (str, find1, find2) {
        if (_str.isEmpty(str))
            return '';
        var pos = str.indexOf(find1);
        if (pos < 0)
            return str;
        var pos2 = str.indexOf(find2, pos + 1);
        return (pos2 < 0)
            ? str.substring(pos + find1.length)
            : str.substring(pos + find1.length, pos2)
    },

    toBool: function (val) {
        return (val == '1' || val == true || val == 'True');
    },

    //合併多個欄位成為字串
    colsToStr: function () {
        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++)
            str += _str.colSep + arguments[i];
        return str;
    },

    trim: function (str) {
        return $.trim(str);
    },
}; //class