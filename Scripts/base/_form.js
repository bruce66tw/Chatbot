
//裡面function預設傳入object(not element or selector)
var _form = {

    //convert serial string to json object
    //https://jsfiddle.net/gabrieleromanato/bynaK/
    //注意: checkbox如果沒有選取, 則不會被serializeArray選進來, 必須寫程式處理 !!
    //排除id 有 '-' 的 checkbox for summernote !!
    toJson: function (form) {
        //get input
        var array = form.serializeArray();

        //範本: jquery foreach
        var json = {};
        $.each(array, function () {
            json[this.name] = this.value || '';
        });

        //要加入 checkbox 欄位, 只會讀取有id的欄位值
        form.find(':checkbox').each(function () {
            var item = $(this);
            var id = item.attr('id');   //summernote 會產生id有"-" 的 checkbox 欄位, 要避開 !!
            if (id !== undefined && id.indexOf('-') < 0)
                json[id] = _check.getO(item);
        });

        //要加入 radio 欄位, 只會讀取有id的欄位值
        form.find(':radio').each(function () {
            var item = $(this);
            var id = item.attr('id');
            if (id !== undefined)
                json[id] = _radio.get(id, form);
        });
        return json;
    },
    toJsonStr: function (form) {
        return JSON.stringify(_form.toJson(form));
    },

    //read json into form (container object)
    //form: form or div object
    readJson: function (form, json) {
        //範本: js foreach json
        for (var key in json) {
            var obj = form.find('#' + key);
            if (obj.length > 0)
                _field.setO(obj, json[key], form);
        }
    },

    /**
     * ??
     檢查欄位清單內是否有空白欄位, 如果有則顯示必填
     讀取 xd-required class
     如果欄位值有錯誤, 則會focus在第一個錯誤欄位
     包含多筆區域 !!
     //@param {array} ids source field id array
     @param {object} form form object, for 多筆畫面??
     //@param {string} msg error msg, 如果沒輸入, 則使用 R.fieldRequired
     @return {bool} true(field ok), false(has empty)
    */
    checkEmpty: function (form) {
        //clear error label first
        form.find('.' + _fun.errCls).removeClass(_fun.errCls);
        form.find('.' + _fun.errLabCls).hide();

        //if (_str.isEmpty(msg))
        //var msg = ;

        //get ids
        //var ids = [];
        var ok = true;
        form.find('.' + _fun.xdRequired).each(function () {
            var me = $(this);
            if (_str.isEmpty(_field.getO(me))) {
                ok = false;
                //me.addClass(_fun.errCls);
                var id = _obj.getId(me);
                if (_str.isEmpty(id))
                    id = _obj.getDataId(me);
                _field.showError(me, id, R.fieldRequired, form);
            }
        });
        return ok;

        //check if ids is string
        //if (typeof ids === 'string') {
        //    ids = [ ids ];    //把字串變成陣列
        //if (ids == null || ids.length == 0)
        //    return true;

        /*
        var status = true;
        if (form) {
            for (var i = 0; i < ids.length; i++) {
                var value = form.find('#' + ids[i]).val();
                if (value == null || value == "") {
                    _field.showError(ids[i], msg, form);
                    if (!find)
                        form.find('#' + ids[i]).focus();
                    status = false;
                }
                else {
                    //驗證過就刪除錯誤訊息??
                    _field.clearFieldError(ids[i], form);
                }
            }
        } else {
            for (var i = 0; i < ids.length; i++) {
                var value = $('#' + ids[i]).val();
                if (value == null || value == "") {
                    _field.showError(ids[i], msg);
                    if (!find)
                        $('#' + ids[i]).focus();
                    status = false;
                }
                else {
                    //驗證過就刪除錯誤訊息??
                    _field.clearFieldError(ids[i]);
                }
            }
        }
        return status;
        */
    },

    /*
    //把json的資料比對checkbox,相同值勾選起來(相同欄位名稱)
    jsonCheckBoxToForm: function (json, formId) {
        var form = $('#' + formId);
        Object.keys(json).map(function (key, index) {
            $('input[name=""]' + key).each(function () {
                if ($(this).val() == json[key]) {
                    $(this).prop("checked", true);
                }
            });
        });
    },
    */    

    //清除所有有id的欄位
    reset: function (form) {
        //form.find('input:text').val('');
        form.find('[id]').each(function () {
            var item = $(this);
            _field.setO(item, '', form);
        });
    },

    /** 
     * @description 傳回要送到後端的儲存資料
     * @param {bool} isNew
     * @param {object} form object
     * @param {object} row json object, for save
     * @param {array} files 單筆資料要上傳的多個檔案, 每個陣列的內容為 [欄位id, 後端變數名稱]
     * @param {array} multis 多筆資料 src
     * @return {FormData}
     */
    getSaveData: function (isNew, form, row, files, multis) {
        files = files || [];
        multis = multis || [];

        var data = new FormData();
        data.append('isNew', isNew);

        //加上單筆資料要上傳的多個檔案
        var i;
        for (i = 0; i < files.length; i++)
            _file.rowAddFile(data, row, files[i][0], files[i][1], form);

        //rows 加入單筆
        var rows = [row];

        //多筆資料的異動/刪除
        var deletes = [];
        for (i = 0; i < multis.length; i++) {
            //異動資料
            _multi.dataAddRows(data, rows, multis[i]); //多筆
            //var hasRows = (multis[i][1] !== null && multis[i][1] !== undefined);
            //if (hasRows)
            //    multis[i][1].rows = rows2;

            //刪除資料
            //var items = hasRows ? multis[i][1].deletes : null;
            deletes[i] = (multis[i].deletes.length == 0)
                ? ''
                : multis[i].deletes.join(_multi.rowSep);    //輸出字串
        }

        //加入
        data.append('rows', _json.toStr(rows));     //加入多筆
        data.append('deletes', deletes.join(_multi.tableSep));  //輸出字串
        return data;
    },

    //單筆資料包含要上傳的多個檔案
    getSaveRow: function (isNew, form, row, files) {
        files = files || [];
        //multis = multis || [];

        var data = new FormData();
        data.append('isNew', isNew);

        //加上單筆資料要上傳的多個檔案
        var i;
        for (i = 0; i < files.length; i++)
            _file.rowAddFile(data, row, files[i][0], files[i][1], form);

        data.append('row', _json.toStr(row));
        return data;
    },

    //??
    //捲動畫面到第一個錯誤欄位
    zz_scrollTopError: function () {
        $('.' + _fun.errLabCls).each(function (i, data) {
            if ($(data).is(':visible')) {
                var t = $(data);
                var x = $(t).offset().top - 185;

                if ($('.wrapper').parent().hasClass('slimScrollDiv'))
                    $('.wrapper').slimScroll({ scrollTo: x });
                else if ($('.wrapper').hasClass('noWrapperScroll'))
                    $('.scroolablePanel').slimScroll({ scrollTo: $(t).position().top - 200 });
                else
                    $("html, body").animate({ scrollTop: x }, "slow");
                return (false);
            }
        })
    },

    /**
     @description set form fields editable or not, 但是不處理按鈕的狀態
     @param {object} form jquery form
     @param {bool} status editable or not
     @return {void}
     */
    setEdit: function (form, status) {
        //var enabled = status ? 'enabled' : 'disabled';
        //var form = $('#' + formId);
        //文字欄位 & textArea (todo: html)
        _text.setStatusO(form.find('input:text'), status);
        _area.setStatusO(form.find('textarea'), status);
        //form.find('input:text').attr('readonly', !status);
        //form.find('textarea').attr('readonly', !status);

        //日期欄位(xd-date為實際輸入欄位!!)
        _date.setStatusO(form.find('.xd-date'), status);

        //下拉式欄位
        //form.find('.xg-select-btn').prop('disabled', !status);
        _select.setStatusO(form.find('select'), status);

        //checkbox & radio
        _check.setStatusO(form.find(':checkbox'), status);
        _radio.setStatusO(form.find(':radio'), status);

        //button
        _btn.setStatusO(form.find('button'), status);

        /*
        form.find(':checkbox').each(function () {
            $(this).icheck(enabled);
        });
        //radio
        form.find(':radio').each(function () {
            $(this).icheck(enabled);
        });
        */
    },

    /**
     @description hide & show form/div (動畫效果)
     @param {array} hides object array to hide
     @param {array} shows object array to show
     @return {void}
     */
    hideShow: function (hides, shows) {
        //hide first
        if (hides) {
            for (var i = 0; i < hides.length; i++) {
                var form1 = hides[i];
                form1.fadeOut(500, function () {
                    form1.hide();
                });
            }
        }

        //show
        if (shows) {
            for (var i = 0; i < shows.length; i++) {
                var form2 = shows[i];
                form2.fadeIn(500, function () {
                    form2.show();
                });
            }
        }
    },

    //切換頁面為 xg-active
    //div: jquery object
    swap: function (div) {
        //debugger;
        var active = $('.xg-swap.xg-active');
        if (div === active)
            return;

        //效果處理
        active.fadeOut(200, function () {
            //debugger;
            active.removeClass('xg-active');

            div.addClass('xg-active');
            div.fadeIn(500);
        });
        //e.preventDefault();
    },

    zz_reset: function (form) {
        //var box = $('#' + form);
        //文字欄位
        form.find('input:text').val('');
    },

}; //class