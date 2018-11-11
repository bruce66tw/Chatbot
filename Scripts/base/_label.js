
//label
var _label = {

    //value by id
    get: function (id, form) {
        return _label.getO(_obj.get(id, form));
    },
    //value by filter
    getF: function (filter, form) {
        return _label.getO(_obj.getF(filter, form));
    },
    //value by object
    getO: function (obj) {
        return obj.text();
    },

    set: function (id, value, form) {
        _label.setO(_obj.get(id, form), value)
    },
    setF: function (filter, value, form) {
        _label.setO(_obj.getF(filter, form), value)
    },
    setO: function (obj, value) {
        obj.text(value);
    },

};