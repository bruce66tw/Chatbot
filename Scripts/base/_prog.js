
var _prog = {
    //filter: '.xg-prog-path',
    me: null,
    path: '',

    //設定 prog path for 清單畫面
    setReadPath: function (init) {
        if (init === undefined || init === true) {
            _prog.me = $('.xg-prog-path');
            _prog.path = _prog.me.text();
        } else {
            _prog.me.text(_prog.path);
        }
    },

    //設定 prog path for 編輯畫面
    setEditPath: function (isNew) {
        var name = isNew ? R.create : R.update;
        _prog.me.text(_prog.path + '-' + name);
    },
};