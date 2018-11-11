
//一般的 select option 
var _select = $.extend({}, _0input, {

    //=== default get/set ===
    getO: function (obj) {
        return (obj.length === 0) ? '' : obj.find('option:selected').val();
    },

    //設定目前選取的item
    //不傳回選取的 option object(自行呼叫 getIndex())
    setO: function (obj, value) {
        filter = 'option[value="' + value + '"]';
        var item = obj.find(filter);
        if (item.length > 0) {
            item.prop('selected', true);
            return item;
        } else {
            //remove selected
            obj.find('option:selected').prop('selected', false);
            return null;
        }
    },

    setStatusO: function (obj, status) {
        obj.prop('disabled', !status);
    },
    //=== end ===


    //get selected index(base 0)
    getIndex: function (id, box) {
        return _select.getIndexO(_obj.get(id, box));
    },
    getIndexO: function (obj) {
        return obj.prop('selectedIndex');
    },

    //get options count
    getCount: function (id, box) {
        return _select.getCountO(_obj.get(id, box));
    },
    getCountO: function (obj) {
        return obj.find('option').length;
    },

    //set by index(base 0)
    setIndex: function (id, idx, box) {
        _select.setIndexO(_obj.get(id, box), idx);
    },
    setIndexO: function (obj, idx) {
        obj.find('option').eq(idx).prop('selected', true);
    },

    //傳回選取的欄位的文字
    getText: function (id, box) {
        return _obj.get(id, box).find('option:selected').text();
    },
    getTextO: function (obj) {
        return obj.find('option:selected').text();
    },

    //傳回data屬性(name)值
    getData: function (id, name, box) {
        return _obj.get(id, box).find('option:selected').data(name);
    },
    getDataO: function (obj, name) {
        return obj.find('option:selected').data(name);
    },

    //重新設定option內容
    //items: 來源array, 欄位為:Id,Text
    setItems: function (id, items, box) {
        var filter = '#' + id;
        var obj = box ? box.find(filter) : $(filter);
        _select.setItemsO(obj, items);
    },
    //by object
    setItemsO: function (obj, items) {
        obj.find("option").remove();
        if (items === null)
            return;

        for (var i = 0; i < items.length; i++) {
            obj.append($("<option></option>").attr("value", items[i].Id).text(items[i].Str));
        }
    },

    //get all options
    //getIdStrExts -> getExts
    getExts: function (id, box) {
        var rows = [];
        _obj.get(id, box).find('option').each(function (i) {
            var me = $(this);
            rows[i] = {
                Id: me.val(),
                Str: me.text(),
                Ext: me.data('ext'),
            };
        });
        return rows;
    },

    //重新設定option內容, 欄位為:Id,Str,Ext
    //setItems2 -> setExts
    setExts: function (id, items, box) {
        var filter = '#' + id;
        var obj = box ? box.find(filter) : $(filter);
        obj.find("option").remove();
        if (items == null)
            return;
        for (var i = 0; i < items.length; i++) {
            obj.append(_str.format("<option data-ext='{0}' value='{1}'>{2}</option>", items[i].Ext, items[i].Id, items[i].Str));
        }
    },

    //把多欄位值寫入json
    //ids: 欄位名稱 array
    valuesToJson: function (json, ids, box) {
        for (var i = 0; i < ids.length; i++)
            json[ids[i]] = _select.get(ids[i], box);
        return json;
    },

    //ie 不支援 option display:none !!
    //filter options by data-ext value
    //rows: 所有option 資料(Id,Text,Ext)
    filterByExt: function (fid, value, rows, box, allItem) {
        if (allItem === undefined)
            allItem = false;
        var obj = _obj.get(fid, box);
        obj.empty();
        //item.find('option').hide();
        var len = rows.length;
        for (var i = 0; i < len; i++) {
            var row = rows[i];
            //if (row.Ext == value)
            if ((allItem === true && row.Ext == '') || row.Ext == value)
                obj.append(_str.format('<option value="{0}">{1}</option>', row.Id, row.Text));
        }

        //選取第0筆
        if (len > 0)
            _select.setIndexO(obj, 0);
    },

}); //class