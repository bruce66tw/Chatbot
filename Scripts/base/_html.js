/*
 處理 html 欄位, 使用 summernote !!
 */
var _html = {
    //see: https://stackoverflow.com/questions/14346414/how-do-you-do-html-encode-using-javascript
    encode: function (value) {
        return $('<div/>').text(value).html();
    },

    decode: function(value){
        return $('<div/>').html(value).text();
    },

    //encode row
    encodeRow: function (row, ids) {
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            row[id] = _html.encode(row[id]);
        }
        return row;
    },

    //更新html欄位內容, 讀取 text()
    update: function(id, box) {
        var filter = '#' + id;
        var obj = (box === undefined) ? $(filter) : box.find(filter);
        //obj.text(value);
        //obj.summernote('code', $(filter).text());
        //debugger;
        obj.summernote('code', obj.text());
    },
    updates: function (ids, box) {
        for (var i = 0; i < ids.length; i++)
            _html.update(ids[i], box);
    },
    
};