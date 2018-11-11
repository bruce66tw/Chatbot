
var _helper = {

    /**
     * 
     */ 
    getBaseProp: function (rowNo, fid, value, type, required, editable, extProp) {
        var attr = "type='" + type + "'" +
            " data-id='" + fid + "'" +
            " name='" + fid + rowNo + "'" +
            " value='" + value + "'";
        if (required === true)
            attr += " required";
        if (editable === false)
            attr += " readonly";
        if (!_str.isEmpty(extProp))
            attr += " " + extProp;
        return _str.trim(attr);
    },
};