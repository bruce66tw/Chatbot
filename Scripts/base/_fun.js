/*
  用來控制公用元件
*/
var _fun = {
    //errTail: '_err',
    //xgError: 'xg-error',

    //constant
    errTail: '_err',                   //error label 欄位id後面會加上這個字元
    errCls: 'xg-err',            //欄位驗証錯誤時會加上這個 class name
    errLabCls: 'xg-errlab',  //error label 的 class name
    //errBoxCls: 'xg-errorbox',      //??_box欄位驗証錯誤時會加上這個 class name
    xdRequired: 'xd-required',

    //變數
    maxFileSize: 50971520,  //上傳檔案限制50M
    localeCode: 'zh-TW',

    //中間傳遞變數
    data: {},

    //variables ??
    isCheck: true,

    /*
      ??
    */
    xgTextBoxValid: function (obj, Regex) {
        var parent = obj.parentNode;
        if (Regex == "") {
            if (obj.value != "") {
                obj.parentNode.classList.remove("xg-error");
            }
            else {
                obj.parentNode.classList.add("xg-error");
                _fun.isCheck = false;
            }
        }
        else {
            if (obj.value.match(new RegExp(Regex)) != null) {
                obj.parentNode.classList.remove("xg-error");
            }
            else {
                obj.parentNode.classList.add("xg-error");
                _fun.isCheck = false;
            }
        }
    },

    /*
     ??
    */
    xgCheckfn: function () {
        _fun.isCheck = true;
        var Inputs = document.getElementsByClassName('xg-textbox');
        for (var i = 0; i < Inputs.length; i++) {
            Inputs[i].childNodes[1].onchange();
        }
        var selects = document.getElementsByClassName('xg-select');
        for (var i = 0; i < selects.length; i++) {
            if (selects[i].childNodes[1].value == 0 || selects[i].childNodes[1].value == "") {
                selects[i].classList.add("xg-error");
                _fun.isCheck = false;
            }
            else {
                selects[i].classList.remove("xg-error");
            }
        }
        return _fun.isCheck;
    },

    /**
     multiple checkbox onclick event
     params
       me : this component
       fid: field id 
       value: field value
       onClickFn: (optional) callback function
     */
    //onClickCheckMulti: function (me, fid, value, separator, onClickFn) {
    zz_onChangeMultiCheck: function (me, fid) {

        //var fid = $(me).attr('data-item-id');
        //var field = $('[data-id="' + fid + '"]');           //field
        var field = $('#' + fid);       //field
        //var box = field.parent();     //找包含所有 checkbox 的 container
        //update value list
        var values = '';
        var texts = '';
        var separator = field.attr('data-separator');
        var onClickFn = field.attr('data-onclick');
        $(field.parent()).find('input:checked').each(function () {
            values += $(this).val() + separator;
            texts += $(this).text() + ',';
        });

        //adjust
        if (values != '') {
            values = values.substring(0, values.length - 1);
            texts = texts.substring(0, texts.length - 1);
        }
        //更新欄位內容
        field.attr('title', texts); //update show text
        field.val(values);           //set field value

        //call user define function
        if (onClickFn != undefined && onClickFn != "")
            onClickFn(me, $(me).val());

    },

    /**
     * (private)包裝jQuery ajax(), 只傳回成功的狀態(包含自訂錯誤訊息)
     * params
     *   url : action url
     *   data: 傳入後端資料
     *   fnSuccess: callback function
     *   //rows: (optional) 多筆資料時必須判斷錯誤欄位在那一個資料群組, rows為多筆資料, 空白表示單筆畫面
     *   formId: (optional) html form object.
     *   //keyFid: (optional) 包含Key的欄位, 此欄位值在多筆資料中必須是唯一
     *   //fnOpenForm: (optonal) 展開畫面的 function
     */
    _ajax: function (json, fnSuccess, forms) {
        var config = {
            //traditional: true,
            success: function (data) {
                //data 參數對應後端 ErrorModel
                //if (data.ErrorMsg != null && data.ErrorMsg != "") {
                if (data && data.ErrorMsg) {
                    //alert(data.ErrorMsg);
                    _tool.msg(data.ErrorMsg);
                } else if (data && data.ErrorFields != null && data.ErrorFields.length > 0) {
                    //傳回: key=field, value=errorCode(在多國語檔案中對應)
                    //有錯誤欄位的情形
                    //if (rows === undefined) {
                    //單筆
                    //var row = data.ErrorRows[0];
                    var fields = data.ErrorFields;
                    for (var i = 0; i < fields.length; i++) {
                        //todo:
                        var field = fields[i];
                        var form = forms[field.GroupNo];
                        var fid = field.Fid;
                        var obj = (field.IsMulti === true)
                            ? _multi.getField(form, field.RowNo, fid)
                            : _obj.get(fid, form);
                        _field.showError(obj, fid, field.ErrorMsg, form);
                        ////有值時
                        //if (formId === undefined)
                        //    _field.showError(row.ErrorFields[i].Key, row.ErrorFields[i].Value)
                        //else
                        //    _field.showError(row.ErrorFields[i].Key, row.ErrorFields[i].Value, formId)
                    }

                    //} else {
                    //    //多筆
                    //    for (var idx = 0; idx < data.ErrorRows.length; idx++) {
                    //        var row = data.ErrorRows[idx];
                    //        //key(value) -> formId
                    //        var formId = $('[id="' + keyFid + '"][value="' + rows[row.RowNo][keyFid] + '"]').closest('#' + formId);
                    //        for (var i = 0; i < row.ErrorFields.length; i++)
                    //            _field.showError(row.ErrorFields[i].Key, row.ErrorFields[i].Value, formId);

                    //        //展開 formId
                    //        if (fnOpenForm !== undefined)
                    //            fnOpenForm(formId);
                    //    }
                    //}
                } else if (fnSuccess) {
                    fnSuccess(data);
                }
            },

            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr != null) {
                    console.log("status" + xhr.status);
                    console.log(thrownError);
                }
            },
            beforeSend: function () {
                _tool.showWait();
            },
            complete: function () {
                _tool.hideWait();
            },
            //async: false
        };
        $.ajax(_json.addJson(json, config));
    },

    //ajax call, 上傳資料不包含 formData
    //傳回json資料
    ajax: function (url, data, fnSuccess, forms) {
        var json = {
            url: url,
            type: 'POST',
            data: data,
            dataType: 'json',   //後端傳回的資料種類
            //processData: false
        };
        _fun._ajax(json, fnSuccess, forms);
    },

    //上傳檔案和資料, 必須使用 FormData
    //processData 為 true(default) 會將傳入 data object轉為字串
    ajaxFormData: function (url, data, fnSuccess, forms) {
        var json = {
            url: url,
            type: 'POST',
            data: data,
            dataType: 'json',       //todo: testing
            cache: false,
            contentType: false,     //false!! 傳入參數編碼方式, default為 "application/x-www-form-urlencoded"
            processData: false,     //false!! 必須傳入字串, 不可為object
        };
        _fun._ajax(json, fnSuccess, forms);
    },

    //傳回 partial view
    ajaxView: function (url, data, fnSuccess) {
        var json = {
            url: url,
            type: 'POST',
            data: data,
            dataType: 'html',
        };
        _fun._ajax(json, fnSuccess);
    },

    /* 暫時用不到
    //動態載入外部 js, for 多國語
    loadJs: function (url) {
        $.getScript(url);
    },
    */

    /**
     * 註冊 pjax
     * params
     *   selector : pjax selector 
     *   container: 要載入UI的container element
     */
    /*
    pjax: function (selector, container) {
        //註冊pjax element
        $(selector).pjax(undefined, container);

        //call after pjax load partial view, pjax無法載入js, 必須手動載入 !!
        $(document).on('ready pjax:success', function (data, status, xhr) {
            //如果source element存在 data-js, 則表示要載入這個js file, 否則載入與controller相同名稱的js file
            var jsFile = $('#gJsFile').text();

            if (_str.isEmpty(jsFile)) {
                //get controller name, 在倒數第2個, js檔案名稱固定為controller小寫
                var url = data.currentTarget.URL.replace('//', '/');
                if (url.substr(url.length - 1, 1) == '/')
                    url = url.substr(0, url.length - 1);
                var items = url.split('/');
                if (items.length >= 4)
                    jsFile = items[items.length - 2].toLowerCase();
                
            }
            if (!_str.isEmpty(jsFile)) {
                $.getScript('/Scripts/view/' + jsFile + '.js', function (data, textStatus, jqxhr) {
                    if (typeof (_me) !== 'undefined')
                        _me.init();
                });
            }
        });
    },
    */

    /**
     * 傳回錯誤訊息(多國語)
     * params
     *   form : 多國語 form 
     *   errorCode: error code
     */
    /*
    errorMsg: function (form, errorCode) {
        if (errorCode == null || errorCode == '')
            return '';
        else if (errorCode.subsubstring(0, 1) == 'E')
            return (_global[errorCode] == null) ? '(no error code: ' + errorCode +')' : _global[errorCode];
        else
            return (form[errorCode] == null) ? '(no error code: ' + errorCode + ')' : form[errorCode];
    },
    */

    /**
     * get value of multiple select field
     * params
     *   fid : field id
     * return : string
     */
    //getMultiSelectValue: function (fid, separator) {
    //    var field = $('#' + fid);
    //    return (field.length == 0) ? '' : field.val().join(separator);
    //},

};//class