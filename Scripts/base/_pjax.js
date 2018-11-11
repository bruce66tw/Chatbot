
//SPA pjax
var _pjax = {

    //原 _xp.init() 
    init: function () {
        //選擇性 binding event 
        //xd-bind 只有用在這裡
        $('a[data-pjax]:not(.xd-bind)').addClass('xd-bind').on('click', function () {
            //post submit
            //var path = _pjax._getPath($(this), '');
            _pjax.submit($(this).data('pjax'));
        });

        /*
        //如果後端驗証失敗, 則取消 submit
        $(document).on('pjax:beforeReplace', function (contents, options) {
        });
        */

        //pjax載入完成後必須程式載入.js檔案
        $(document).on('pjax:success', function (data, status, xhr) {
            //先載入 JsLib if need
            var jsLib = $('#_JsLib').val();
            if (!_str.isEmpty(jsLib)) {
                $.getScript('../Scripts/' + jsLib + '.js');
            }

            //如果view包含_JsView這個hidden欄位, 則表示要載入指定的js檔案, 
            //否則載入與controller相同名稱的js file
            var jsView = $('#_JsView').val();
            if (_str.isEmpty(jsView)) {
                //get controller name, 在倒數第2個, js檔案名稱固定為controller小寫
                var url = data.currentTarget.URL.replace('//', '/');
                if (url.substr(url.length - 1, 1) == '/')
                    url = url.substr(0, url.length - 1);
                var items = url.split('/');
                if (items.length >= 4)
                    jsView = items[items.length - 2].toLowerCase();
            }

            //載入 jsView
            if (!_str.isEmpty(jsView)) {
                $.getScript('../Scripts/view/' + jsView + '.js', function (data, textStatus, jqxhr) {
                    //載入成功後執行 init()
                    if (typeof (_me) !== 'undefined')
                        _me.init();
                });
            }
        });
    },

    /*
    //get menu path, recursive
    _getPath: function (me, path) {
        //get this text
        if (path != '')
            path = _str.colSep + path;
        path = me.text().trim() + path;

        //find parent ul
        var ul = me.closest('ul');
        if (ul.length == 0)
            return path;

        //find prev a
        var a = ul.prev('a');
        if (a.length == 0)
            return path;

        //add parent text
        path = a.text().trim() + _str.colSep + path;

        //find parent ul
        ul = a.closest('ul');
        if (ul.length == 0 || !ul.hasClass('xg-leftmenu-panel'))
            return path;

        //case of have parent ul, recursive call
        return _pjax._getPath(ul, path);
    },
    */

    //原 _xp.pjaxLoad()
    //預設container: .xd-body
    submit: function (url, json, box) {
        box = box || '.xd-body';
        var data = { url: url, container: box, replace: false };
        if (json === undefined) {
            data.type = 'GET';
        } else {
            data.data = json;
            data.type = 'POST';
        }

        $.pjax(data);
    },

};//class