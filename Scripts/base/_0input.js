
//所有輸入欄位的基底類別 !!
//前面使用_0, 確保這個類別會先載入, 否則子代類別會error !!
var _0input = {

    //get value by id
    get: function (id, box) {
        return this.getO(_obj.get(id, box));
    },
    //get value by data-id
    getD: function (dataId, box) {
        return this.getO(_obj.getD(dataId, box));
    },
    //get value by filter
    getF: function (filter, box) {
        return this.getO(_obj.getF(filter, box));
    },
    //get value by object
    //同時傳入 box for _radio.js !!
    getO: function (obj) {
        return obj.val();
    },

    //set value
    set: function (id, value, box) {
        this.setO(_obj.get(id, box), value)
    },
    setD: function (dataId, value, box) {
        this.setO(_obj.getD(dataId, box), value)
    },
    setF: function (filter, value, box) {
        this.setO(_obj.getF(filter, box), value)
    },
    setO: function (obj, value) {
        obj.val(value);
    },

    //set status
    setStatus: function (id, status, box) {
        this.setStatusO(_obj.get(id, box), status);
    },
    setStatusD: function (dataId, status, box) {
        this.setStatusO(_obj.getD(dataId, box), status);
    },
    setStatusF: function (filter, status, box) {
        this.setStatusO(_obj.getF(filter, box), status);
    },
    setStatusO: function (obj, status) {
        obj.prop('readonly', !status);
    },

};//class