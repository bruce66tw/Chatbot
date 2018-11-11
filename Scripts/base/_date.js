
//處理日期欄位(使用bootstrap-calendar) 和日期資料
var _date = $.extend({}, _0input, {

    //=== get/set start ===
    getO: function (obj) {
        return obj.val();
    },

    setO: function (obj, value) {
        obj.val(_date.toDate(value));
    },

    setStatusO: function (obj, status) {
        obj.prop('disabled', !status);
    },


    //=== 日期元件 start ===
    //initial by id
    init: function (id, box, fnOnChange) {
        var obj = _str.isEmpty(id)
            ? $('.xg-date')
            : _obj.get(id, box).closet('.xg-date');
        _date.initO(obj, fnOnChange);
    },

    //initial by object(s)
    initO: function (obj, fnOnChange) {
        /*
        //datepicker指向 date input 外面的 div
        obj = (obj === null || obj === undefined)
            ? $('.xg-date')
            : obj.closet('.xg-date');
        */

        //日期欄位
        obj.datepicker({
            format: 'yyyy/mm/dd',
            autoclose: true,
            showOnFocus: false,
            //startDate: '-3d'            
        }).on('changeDate', function (e) {
            //$(this).datepicker('hide');
            //傳入 fid, value
            if (fnOnChange !== undefined) {
                var me = $(this);
                var fid = !_str.isEmpty(me.attr('id')) ? me.attr('id') : me.data('id');
                fnOnChange(fid, me.val());
            }
        });

        //取消event listen, 否則清除時會顯示日曆(jquery 3.21 會listen) !!
        obj.find('.input-group-addon').off('click');
    },

    //for 多筆區域
    initByBox: function (box, fnOnChange) {
        _date.initO(box.find('.xg-date'), fnOnChange);
    },

    //show/hide datepicker
    toggle: function (me) {
        //$(me).parent().parent().find('input').trigger('focus');
        $(me).parent().parent().datepicker('show');
    },

    //clean value
    clean: function (me) {
        $(me).parent().parent().datepicker('update', '');
    },

    //產生一個日期元件(用於多筆區域), 參考 XgDateHelper
    //必須執行 _data.init()
    //input 欄位放一個 xd-date for 判斷欄位種類為日期 !!
    render: function (dataId, value, required, extClass) {
        extClass = extClass || '';
        if (required === true)
            extClass += ' ' + _fun.xdRequired;
        //span 要放在外面, 跟 XgDateHelper 不同 !!
        return _str.format("" +
            "<div class='input-group date xg-date' data-provide='datepicker'>" +
            "    <input data-id='{0}' value='{1}' type='text' class='form-control xd-date {2}'>" +
            "    <div class='input-group-addon'>" +
            "        <i class='fa fa-times' onclick='_date.clean(this)'></i>" +
            "        <i class='fa fa-calendar' onclick='_date.toggle(this)'></i>" +
            "    </div>" +
            "</div>" +
            "<span data-id2='{3}' class='{4}'></span>", 
            dataId, _date.toDate(value), extClass, dataId + _fun.errTail, _fun.errLabCls);
    },

    //=== 計算 start ===
    /**
      傳回起迄日期(json) for 日期欄位查詢
      param {string} start 開始日期欄位id
      param {string} end 結束日期欄位id
      params {object} box box object
      return {json} 包含start, end欄位
     */
    getStartEnd: function(start, end, box) {
        //var start2 = box.find
    },

    //today: yyyy/mm/dd
    today: function(){
        var today = new Date();
        return today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
    },

    //西元年度
    getYear: function() {
        return (new Date()).getFullYear();
    },

    //to date format(考慮多國語)
    toDate: function (value) {
        return (_str.isEmpty(value))
            ? ''
            : moment(value).format(R.dateEditFormat);
    },

    //get datetime string
    //time為下拉欄位
    getDt: function (fDate, fTime, box) {
        var date = _date.get(fDate, box);
        var time = _select.get(fTime, box);
        if (date == '')
            return '';
        else
            return (time == '') ? date : date + ' ' + time;
    },

    //date1是否大於date2
    isBig: function(date1, date2) {
        return (Date.parse(date1) > Date.parse(date2));
    },

    //計算月份差距 by string
    getMonthDiff: function (start, end) {
        return (_str.isEmpty(start) || _str.isEmpty(end))
            ? 0
            : _date.getMonthDiffByDate(new Date(start), new Date(end));
    },

    //計算月份差距 by date(不考慮日)
    getMonthDiffByDate: function (d1, d2) {
        //var months;
        var months = (d2.getFullYear() - d1.getFullYear()) * 12 + d2.getMonth() - d1.getMonth() + 1;
        //if (d2.getDate() > d1.getDate())
        //    months++;
        return months;
    },

    //日期(yyyy/mm/dd) 加上年, 傳回新的日期字串
    addYear: function (date, year) {
        return (parseInt(date.substring(0, 4)) + year) + date.substring(4);
    },

}); //class