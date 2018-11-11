var _me = {
    init: function () {
        _me.msgBox = $('.xu-msgs');
        /*
        $('xu-robot-msg a').click(function () {
            alert('click');
        });
        */
    },

    onKeyPressQ: function (e) {
        //check
        if (e.keyCode === 13) {
            var msg = e.currentTarget.value;
            _me.sendMsg(msg);
            e.currentTarget.value = '';
        }
    },

    //send msg
    sendMsg: function (msg) {
        //string length must >= 2
        if (_str.isEmpty(msg) || msg.length < 2)
            return;

        _fun.ajaxView('/Home/Send', { msg: msg }, function (data) {
            //add msg
            var box = _me.msgBox;
            box.append(data);
            //.on('click', 'a', _me.onClickMsg(this));
            //obj.find('xu-robot-msg').on('click', _me.onClickMsg(this));

            //scroll to bottom, not work !!
            //var box2 = $('.xu-msgs-box');
            box.scrollTop(box.prop('scrollHeight'));

            //reset input
            //field.value = '';

            //write into chat
            //alert(data);
        });
    },

    onClickMsg: function (me) {
        //event.preventDefault();
        _me.sendMsg(me.text+'?');
        return false;
    },
};