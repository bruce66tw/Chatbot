
//注意: 單筆時, 要設定 id(只設定第1個radio), name
var _radio = $.extend({}, _0input, {

    //=== get ===
    //get value by id, 只有一個欄位會設定id(or data-id)
    //改成用name來查欄位
    get: function (id, box) {
        return _radio.getF('[name=' + id + ']', box);
    },
    /*
    //get value by data-id
    getD: function (dataId, box) {
        return _radio.getF('[data-id=' + dataId + ']', box);
    },
    //get value by name
    getN: function (name, box) {
        return _obj.getF('[name=' + name + ']', box);
    },
    //get value by filter, filter加上 :checked 再取值 !!
    getF: function (filter, box) {
        return _radio.getO(_obj.getF(filter + ':checked', box));
    },
    */
    //此時 obj 為單一物件
    getO: function (obj) {
        obj = obj.find(':checked');
        return (obj.length == 0) ? '' : obj.val();
    },
    /*
    //此時 obj 為 array
    getO2: function (objs) {        
        return objs.find(':checked').val();
    },
    */

    //=== set ===
    //改成用name來查欄位
    set: function (id, value, box) {
        _radio.setF('[name=' + id + ']', value, box);
    },
    /*
    setD: function (dataId, value, box) {
        _radio.setF('[data-id=' + dataId + ']', value, box);
    },
    //使用 prop 比較好
    setN: function (name, value, box) {
        _obj.setF('[name=' + name + ']', value, box);
    },
    setF: function (filter, value, box) {
        _obj.getF(filter + '[value=' + value + ']', box).prop('checked', true);
    },
    */
    //此時 obj 為單一物件
    setO: function (obj, value) {
        obj = obj.find('[value=' + value + ']');
        if (obj.length > 0)
            obj.prop('checked', true);
    },
    /*
    //此時 obj 為 array
    setO2: function (obj, value) {
        obj.find('[value=' + value + ']').prop('checked', true);
    },
    */

    //set status by name
    //改成用name來查欄位
    setStatus: function (id, status, box) {
        _radio.setStatusF('[name=' + id + ']', status, box);
    },
    /*
    setStatusN: function (name, status, box) {
        _obj.getF('[name=' + name + ']', box).attr('disabled', !status);
    },
    */
    setStatusO: function (obj, status) {
        obj.attr('disabled', !status);
    },

    /**
     button radio onclick event
     params
       me : this component
       fid: field id 
       value: field value
       onClickFn: (optional) callback function
     */
    /*
    _onClickBtnRadio: function (me, fid, value, onClickFn) {
        //unselect所有欄位
        fid = '#' + fid;
        var field = $(me);
        var box = field.closest(fid + '_box');      //找最近的 xxx_box 元素, 因為考慮相同 id的情況
        box.find('.active').removeClass('active');

        //更新欄位內容
        field.addClass('active');   //high light
        box.find(fid).val(value);   //set field value

        //更新欄位 xxx_now 內容
        box.find(fid + '_now').val(field.attr('data-value'));

        //call user define function
        //if (onClickFn != undefined && onClickFn != "")
        if (onClickFn)
            onClickFn(me, value);
    },

    //get field value
    getValue: function (fid) {
        var me = $('[name="' + fid + '"]:radio');
        if (me.length > 0) {
            return me.parent().hasClass('checked') ? me.val() : '';
        } else {
            return '';
        }
    },


    //=== 停用 start ===
    //set status to editable or not
    setEdit: function (fid, status) {
        $('#' + fid).icheck(enabled);
    },

    //set status, 使用 icheck
    //radio 使用 name屬性, 不是id(因為多個 radio 為一個群組)
    setStateByValue: function (fid, value) {
        $('[name="' + fid + '"]:radio').each(function () {
            var me = $(this);
            me.icheck(me.val() == value ? 'checked' : 'unchecked');
        });
    },
    //=== 停用 end ===
    */

    /** 
     for 多筆資料only(data-id)
     產生 checkbox html 內容, 與後端 XgCheckHelper 一致
     @param {string} fid (optional)id/data-id 
     @param {string} label (optional)show label 
     @param {bool} checked default false, 是否勾選
     @param {string} value (optional) 如果null則為1
     @param {bool} editable default true, 是否可編輯
     @param {string} boxClass (optional) boxClass
     @param {string} extClass (optional) extClass
     @param {string} extProp (optional) extProp
     @return {string} html string.
    */
    //render: function (isId, id, label, checked, editable, value, onClickFn) {
    render: function (fid, label, checked, value, editable, extClass, extProp) {
        var html = "" +
            "<label class='xg-radio {0}'>" +
            "   <input type='radio'{1}>{2}" +
            "   <span></span>" +
            "</label>";

        //adjust
        label = label || '';
        //boxClass = boxClass || '';
        extClass = extClass || '';
        extProp = extProp || '';
        value = value || '';
        if (label == '')
            label = '&nbsp;';
        if (_str.isEmpty(value))
            value = 1;

        //attr
        extProp += " data-id='" + fid + "' name='" + fid + "'" + 
            " value='" + value + "'";
        if (checked)
            extProp += ' checked';
        if (editable !== undefined && !editable)
            extProp += ' disabled';    //disabled='disabled'

        return _str.format(html, extClass, extProp, label);
    },

}); //class