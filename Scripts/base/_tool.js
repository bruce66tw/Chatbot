
//小元件
var _tool = {

    //callback function when click confirmation yes button.
    //底線開頭表示private variables
    //_fnOnClickAnsYes: null,
    //_fnOnClickAnsNo: null,
    
    //_msg: null,

    _initMsg: function (isMsg) {
        if (isMsg) {
            if (_tool._msg !== undefined)
                return;

            _tool._msg = {};
            var box = _tool._msg;
            var filter = '#xgMsg';
            var obj = $(filter);
            obj.find('.modal-footer button').text(R.msgOkBtn);  //設定 button text
        } else {
            if (_tool._ans !== undefined)
                return;

            _tool._ans = {};
            var box = _tool._ans;
            var filter = '#xgAns';
            var obj = $(filter);
            obj.find('.modal-footer button:first-child').text(R.ansNoBtn);  //設定 button text
            obj.find('.modal-footer button:nth-child(2)').text(R.ansYesBtn);  //設定 button text
        }

        box.obj = obj;
        //box.title = obj.find('.modal-title');
        box.text = obj.find('.modal-body p');
    },

    /**
     * 顯示 message box
     * param :
     *   title
     *   msg
     */
    //msg: function (msg, title, fnOk) {
    msg: function (msg, fnOk) {
        _tool._initMsg(true);
        var box = _tool._msg;
        //if (!title)
        //    title = 'Message';
        //_tool._msgTitle.text(title);
        box.text.html(msg);
        //box.obj.modal('show');
        _modal.showO(box.obj);

        //set callback
        _tool._fnOnClickMsgOk = fnOk;
    },

    //??
    onClickCloseMsg: function () {
        _modal.hideO(_tool._msg.obj);
    },

    /**
     * 顯示 confirmation 
     * param :
     *   title
     *   msg
     *   yesBtnText
     *   fnYes
     */
    //ans: function (title, msg, yesBtnText, fnYes, fnCancel) {
    ans: function (msg, fnYes, fnCancel) {
        //if (!yesBtnText)
        //    yesBtnText = 'Yes';

        /*
        $('#xgAnsTitle').text(title);
        $('#xgAnsText').html(msg);
        $('#xgAnsYes').text(yesBtnText);
        $('#xgAns').modal('show');
        */

        _tool._initMsg(false);
        var box = _tool._ans;
        //if (!title)
        //    title = 'Message';
        //_tool._msgTitle.text(title);
        box.text.text(msg);
        //box.obj.modal('show');
        _modal.showO(box.obj);

        //set callback
        _tool._fnOnClickAnsYes = fnYes;
        _tool._fnOnClickAnsNo = (fnCancel === undefined) ? null : fnCancel;
        /*
        if (fnCancel === undefined)
            _tool._fnOnClickAnsNo = null;
        else
            _tool._fnOnClickAnsNo = fnCancel;
        */
    },

    /**
     * 顯示 alert(自動關閉), 使用 bootstrap alert
     * msg
     * color: default blue, R(red)
     */
    alert: function (msg, color) {
        //return;
       
        $('#xgAlertMsg').text(msg);
        var form = $('#xgAlert');
        //console.log('top=' + $(document).scrollTop());
        //form.css('top', ($(document).scrollTop() + 3) + 'px');
        form.fadeIn(500, function () {
            form.show();
            //5秒後關閉 alert
            setTimeout(function () {
                _tool._onClickAlertClose();
            }, 5000);//5000=5 seconds
        });
    },

    /**
     * 在畫面右上方顯示 toast
     * param :
     *   msg : message to display
     *   type : S(success),I(info),E(error),W(warning)
     */
    toast: function (msg, type) {
        //??
        if (!type || type == 'S')
            wanotification.showSuccessNofificationMessage(msg);
        else if (type == 'I')
            wanotification.showInfoNofificationMessage(msg);
        else if (type == 'E')
            wanotification.showErrorNofificationMessage(msg);
        else if (type == 'W')
            wanotification.showWarningNofificationMessage(msg);
    },

    //顯示等待中...畫面
    showWait: function () {
        //$('body').addClass('xg-show-loading');
        $('#xgWait').show();
    },
    hideWait: function () {
        //$('body').removeClass('xg-show-loading');
        $('#xgWait').hide();
    },

    _onClickAlertClose: function () {
        var form = $('#xgAlert');
        form.fadeOut(500, function () {
            form.hide();
        });
    },

    /**
     * triggered when user click confirmation yes button
     * called by XgAnsHelper
     */
    _onClickAnsYes: function () {
        if (_tool._fnOnClickAnsYes) {
            //$('#xgAns').modal('hide');
            _modal.hideO(_tool._ans.obj);
            _tool._fnOnClickAnsYes();
        }
    },
    _onClickAnsNo: function () {
        if (_tool._fnOnClickAnsNo)
            _tool._fnOnClickAnsNo();
        //$('#xgAns').modal('hide');
        _modal.hideO(_tool._ans.obj);
    },
    _onClickMsgOk: function () {
        if (_tool._fnOnClickMsgOk)
            _tool._fnOnClickMsgOk();
        //$('#xgMsg').modal('hide');
        _modal.hideO(_tool._msg.obj);
    },

}; //class