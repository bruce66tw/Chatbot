
//注意: 欄位validation時, 輸入欄位與error span 的位置關係只有是2種情形:
//  1.在同一個parent (可以是不同child level)
//  2.parent的下個相鄰位置(ex: Date)
var _field = {

    get: function (id, box) {
        return _field.getO(_obj.get(id, box), box);
    },

    //讀取欄位值
    getO: function (obj, box) {
        switch (_field.getType(obj)) {
            case 'checkbox':
                return _check.getO(obj);
            case 'radio':
                //此時 obj 為 array
                return _radio.get(obj.attr('name'), box);
            case 'textarea':
                //重要!! 要設定它的 html 屬性!!
                return _area.getO(obj);
            case 'select':
                return _select.getO(obj);
            case 'label':
                return _label.getO(obj);
            default:
                //case 日期欄位                
                if (obj.hasClass('xd-date')) {
                    return _date.getO(obj);
                } else {
                    //text, textarea
                    return obj.val();
                }
                break;
        }
    },

    //radio 需要 box(container object)
    setO: function (obj, value, box) {
        switch (_field.getType(obj)) {
            case 'checkbox':
                _check.setO(obj, value);
                break;
            case 'radio':
                //此時 obj 為 array
                value = value || '0';
                _radio.set(obj.attr('name'), value, box);
                break;
            case 'textarea':
                //重要!! 要設定它的 html 屬性!!
                value = _html.decode(value);
                obj.html(value);
                obj.val(value);     //也要設定這個屬性 !!
                //obj.text(value);
                break;
            case 'select':
                _select.setO(obj, value);
                break;
            case 'label':
                _label.setO(obj, value);
                break;
            default:
                //case 日期欄位                
                if (obj.hasClass('xd-date')) {
                    _date.setO(obj, value);
                } else {
                    //text, textarea
                    obj.val(value);
                }
                break;
        }
    },

    getType: function (obj) {
        var type = obj.attr('type') || obj.prop('type') || obj.prop('tagName');
        return (type === undefined) ? '' : type.toLowerCase();
    },

    //get value by type
    //box: radio 需要傳入 container object, 其他則不需要 !!
    getByType: function (obj, type, box) {
        switch (type) {
            case 'checkbox':
                return _check.getO(obj);
            case 'radio':
                //alert('radio not yet !!');
                return _radio.get(obj.attr('name'), box);
            case 'textarea':
                return obj.html();   //html !!
            default:
                //同時適用select option
                return obj.val();
        }
    },

    //檢查欄位是否binding event
    isBound: function(filter) {
        var field = $(filter);
        return (field.find(':not(.bound)').length == 0);
    },

    /* 
     設定欄位狀態
    */
    setEdit: function (fid, status, box) {
        //文字欄位
        _obj.get(fid, box).attr('readonly', !status);
    },
    setEdits: function (fids, status, box) {
        //文字欄位
        for (var i = 0; i < fids.length; i++) 
            _obj.get(fids[i], box).attr('readonly', !status);
    },

    //檢查欄位是否存在, true/fales
    exist: function (id, form) {
        return _field.existF('#' + id, form);
    },

    existF: function (filter, form) {
        var field = (form === undefined) ? $(filter) : form.find(filter);
        return (field.length > 0);
    },


    //=== below is old ===
    /**
     * select option on change event.
     *
     */
    _onChangeSelect: function (me) {
        //var tt = 'tt';
        var className = 'selected';
        var len = me.options.length;
        for (var i = 0; i < len; i++) {
            var opt = me.options[i];
            var opt2 = $(opt);

            // check if selected
            if (opt.selected) {
                if (!opt2.hasClass(className))
                    opt2.addClass(className);
            } else {
                if (opt2.hasClass(className))
                    opt2.removeClass(className);
            }
        }
    },

    /**
     * set select field value
     * params
     *   data : address
     * return : true/false
     */
    setSelect: function (fid, value) {
        $('#' + fid).selectpicker('val', value);
    },

    setValue: function (fid, value) {
        var field = $('#' + fid);
        if (field.length == 0)
            console.log('no field: ' + fid);
        else
            field.val(value);
    },

    /**
     * 寫入 multiple select value (使用 bootstrap-select)
     * 多選欄位值為陣列, 必須轉成字串
     * param :
     *    fid: 欄位id
     *    separator: 分隔符號
     */
    writeMultiValue: function (fid, separator) {
        var value = $('#' + fid + '_tmp').val();
        if (value)
            value = value.join(separator);
        $('#' + fid).val(value);
    },

    //把json塞進label的text(相同欄位名稱)
    setLabel: function (fid, value) {
            $('#'+fid).text(value); 
    },

    /* 
     顯示欄位的錯誤訊息, fid欄位會直接加上 error className
     先找 error label, 再找上面相鄰的 object, 然後加入 xg-error
     para:
       fid: 欄位id
       msg: 顯示訊息, 可為空白, 此時會顯示錯誤外框, 但是無錯誤訊息
       form: (optional) form(jquery object), for 多筆畫面
     return: void
    */
    showError: function (obj, fid, msg, form) {
        //輸入欄位增加 error class
        obj.addClass(_fun.errCls);

        //label欄位設定文字內容
        var filter = '[data-id2=' + fid + _fun.errTail + ']';
        //先找parent下
        //var label = _obj.getF(filter, form);
        var parent = obj.parent(); 
        var label = parent.find(filter);
        if (label.length == 0)
            label = parent.next();
        //obj.addClass(_fun.errCls);
        label.text(msg);
        label.show();
        /*
        var labelFid = '#' + fid + _fun.errTail;
        var error = (form === undefined) ? $(labelFid) : form.find(labelFid);
        error.text(msg);

        //找相鄰的上一個 element
        var field = error.prev();
        var id = field.attr('id');
        if (id && id.substring(id.length - 4) == '_box')
            field.addClass(_fun.errBoxCls);   //error label -> field/div (相鄰)
        else
            field.addClass(_fun.errCls);      //error label -> field/div (相鄰)

        _form.scrollTopError();
        */
    },

    /* 
    ??
     移除欄位的 error class
     para:
       fid: 欄位id
       form: (optional) form(jquery object), for 多筆畫面
     return: void
    */
    clearFieldError: function (fid, form) {
        var labelFid = '#' + fid + _fun.errTail;
        var error = (form === undefined) ? $(labelFid) : form.find(labelFid);
        var field = error.prev();
        var id = field.attr('id');
        //
        field.removeClass(_fun.errCls)
        /*
        if (id && id.substring(id.length - 4) == '_box')
            field.removeClass(_fun.errBoxCls);   //error label -> field/div (相鄰)
        else
            field.removeClass(_fun.errCls);      //error label -> field/div (相鄰)
        */
    },

    /* 
     移除所有 error class
     return: void
    */
    clearFieldsError: function () {
        //尋找所有 err_ 開頭的 dom
        $('.' + _fun.errCls).removeClass(_fun.errCls);
        //$('.' + _fun.errBoxCls).removeClass(_fun.errBoxCls);
    },

}; //class