var wanba = {
    login: function (loginInfo, callback) {
        window.getOpenKey(function (d) {
            loginInfo.openid = d.data.openid;
            loginInfo.openkey = d.data.openkey;
            loginInfo.pf = window.OPEN_DATA.pf;
            callback(loginInfo);
        });
    },
    setUserGameData: function () {
        mqq.ui.popBack();
    }
};