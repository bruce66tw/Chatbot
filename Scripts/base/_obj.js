
//jquery object
var _obj = {

    //get object by id
    get: function (id, box) {
        return _obj.getF('#' + id, box);
    },
    //get object by data-id
    getD: function (dataId, box) {
        return _obj.getF('[data-id=' + dataId + ']', box);
    },
    //get object by value
    getV: function (value, box) {
        return _obj.getF('[value=' + value + ']', box);
    },
    //get object by filter
    getF: function (filter, box) {
        return (box === undefined) ? $(filter) : box.find(filter);
    },

    getId: function (obj) {
        return (obj.length > 0) ? obj.attr('id') : '';
    },

    getDataId: function (obj) {
        return (obj.length > 0) ? obj.data('id') : '';
    },

    isShow: function (obj) {
        return obj.is(':visible');
    },

    //檢查欄位是否存在, true/fales
    exist: function (id, box) {
        return _obj.existF('#' + id, box);
    },

    existF: function (filter, box) {
        var field = (box === undefined) ? $(filter) : box.find(filter);
        return (field.length > 0);
    },

    hasAttr: function (id, attr, box) {
        return _obj.get(id, box).attr(attr);
    },

}; //class