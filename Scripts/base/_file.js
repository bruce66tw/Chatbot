
//檔案上傳欄位(單筆) & 檔案處理
var _file = {

    //初始化, 在一開始載入畫面資料時呼叫
    init: function(id, path, box) {
        //_obj.getF(_file.fileF(id), box).val('');
        var file = _obj.getF(_file.fileF(id), box);
        file.val('');
        file.data('fun', '');
        _file.setPath(id, path, box);
        /*
        //file element 要 reset
        var file = _obj.getF(_file.fileF(id), box);
        //var $el = $('#example-file');
        file.wrap('<form>').closest('form').get(0).reset();
        file.unwrap();
        */
    },

    //get label filter of file
    labelF: function(id) {
        return '.xd-' + id + '-url';
    },
    //get file filter
    fileF: function (id) {
        return '[data-id=' + id + ']';
    },

    //顯示路徑(檔名only)
    setPath: function (id, path, box) {
        var label = _obj.getF(_file.labelF(id), box);
        var link = label.find('a');
        var fileName = _file.getFileName(path);
        link.text(fileName);    //儲存路徑的地方
        link.attr('href', path);

        //顯示label和刪除link
        if (_str.isEmpty(fileName))
            label.hide();
        else
            label.show();
    },

    //private: 讀取某個字串後面的文字
    _getFileAfter: function (path, sep) {
        //var name = path;
        var pos = path.lastIndexOf(sep);
        if (pos > 0)
            path = path.substring(pos + 1);
        return path;
    },

    //讀取檔名
    getFileName: function (path) {
        return _file._getFileAfter(path, '/');
    },

    //讀取副檔名
    getFileExt: function (path) {
        return _file._getFileAfter(path, '.');
    },

    //private: get file object
    _getObject: function (id, box) {
        return _obj.getF(_file.fileF(id), box);
    },

    //增加一個路徑
    addPath: function (id, path, box) {
        var obj = _file._getObject(id, box);
        _file._setStatus(obj, 'A');
        _file.setPath(id, path, box);
    },

    //刪除路徑(設定 data-deleted 屬性)
    deletePath: function (id, box) {
        var obj = _file._getObject(id, box);
        _file._setStatus(obj, 'D');
        _file.setPath(id, '', box);
    },

    //private
    //set data-fun
    _setStatus: function(obj, status) {
        obj.data('fun', status);
    },

    //路徑是否刪除
    isDeleted: function (id, box) {
        var obj = _file._getObject(id, box);
        return (obj.data('fun') == 'D');
    },

    //是否有 "異動" 的上傳檔案
    getFile: function (id, box) {
        var obj = _file._getObject(id, box);
        var files = obj.get(0).files;
        return (files.length > 0) ? files[0] : null;
    },

    //是否上傳檔案, 包含原本存在和後來選取的檔案(判斷link內容是否空白)
    //page沒有foucs時, visible會傳回false, 所以在這裡判斷 href
    hasFile: function (id, box) {
        //return _obj.getF(_file.labelF(id), box).find('a').is(':visible');
        return !_str.isEmpty(_obj.getF(_file.labelF(id), box).find('a').attr('href'));
    },

    //row add file for upload & save row
    rowAddFile: function (data, row, id, serverId, fm) {
        var file = _file.getFile(id, fm);
        if (file != null)
            data.append(serverId, file);
        else if (_file.isDeleted(id, fm))
            row['_' + id] = 1;
    },

    //formData add file for upload
    dataAddFile: function (data, id, serverId, fm) {
        var file = _file.getFile(id, fm);
        if (file != null)
            data.append(serverId, file);
    },

    onChangeFile: function (me) {
        //case of 無檔案
        var me2 = $(me);
        var value = me.value;
        var id = me2.data('id');
        if (_str.isEmpty(value)) {
            _file.deletePath(id);
            return;
        }

        //檢查副檔名
        var exts = me2.data('exts').toLowerCase();
        if (!_str.isEmpty(exts)) {
            var ext = _file.getFileExt(value).toLowerCase();
            exts = ',' + exts + ',';
            if (exts.indexOf(',' + ext + ',') < 0){
                _tool.msg(R.uploadFileNotMatch);
                me.value = '';
                return;
            }
        }

        //檢查檔案大小
        var max = me2.data('max');
        if (me.files[0].size > max * 1024 * 1024) {
            _tool.msg(_str.format(R.uploadFileNotBig, max));
            me.value = '';
            return;
        }

        //case ok
        _file.addPath(id, value);
    },

}; //class