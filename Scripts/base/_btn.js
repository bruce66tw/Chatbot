
//button
var _btn = {

    setStatus: function (id, status, box) {
        _obj.get(id, box).prop('disabled', !status);
    },
    setStatusO: function (obj, status) {
        obj.prop('disabled', !status);
    },
    setStatusF: function (filter, status, box) {
        _obj.getF(filter, box).prop('disabled', !status);
    },

}; //class