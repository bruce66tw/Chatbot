
//validation(資料檢查), 使用 jquery validate
var _valid = {

    init: function (fm, inputConfig) {

        //default config
        var config = {
            unhighlight: function (element, errorClass, validClass) {
                var me = $(element);
                me.data('edit', 1);    //註記此欄位有異動
            }
        };

        //加入外部傳入的自定義組態
        if (inputConfig)
            config = _json.addJson(inputConfig, config);

        return fm.validate();
    },

    reInit: function (fm, inputConfig) {
        fm.removeData('validator');
        fm.removeData('unobtrusiveValidation');
        _valid.init(fm, inputConfig);
    },

    /**
     * check regular
     * params
     *   fields : fields id array
     *   msg : error message
     *   expr : regular expression
     * return : true/false
     */
    anyRegularsWrong: function (fields, msg, expr) {
        if (fields == null || fields.length == 0)
            return false;

        //var expr = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var find = false;
        for (var i = 0; i < fields.length; i++) {
            var value = $('#' + fields[i]).val();
            if (!expr.test(value)) {
                find = true;
                _field.showError(fields[i], msg);
            }
        }
        return find;
    },

    /**
     * check email 
     * see : http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
     * params
     *   data : email address
     * return : true/false
     */
    anyEmailsWrong: function (fields, msg) {
        var expr = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return _valid.anyRegularsWrong(fields, msg, expr);
    },

    /**
     * check address
     * params
     *   data : address
     * return : true/false
     */
    anyAddressesWrong: function (fields, msg) {
        var expr = /^\d+\w*\s*(?:(?:[\-\/]?\s*)?\d*(?:\s*\d+\/\s*)?\d+)?\s+/;
        return _valid.anyRegularsWrong(fields, msg, expr);
    },

}; //class