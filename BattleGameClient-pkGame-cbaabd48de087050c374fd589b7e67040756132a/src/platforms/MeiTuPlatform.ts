class MeiTuPlatform implements IPlatform {
    public platformData: any;

    public constructor() {
        this.init();
    }

    private init(): void {
        Statistics.init('MeiTu', "https://gameanalysis.egret.com/pk/stat.php");
        //初始化GameId
        App.CurrGameId = parseInt(window["egretGid"]);
    }

    public login(callBack: Function): void {
        //返回数据
        this.platformData = {
            roomId: egret.getOption("roomId"),
            appId: egret.getOption("appId"),
            token: egret.getOption("token"),
            showAd: egret.getOption("showAd"),
            adid: egret.getOption("adId")
        }

        App.CurrRoomId = this.platformData.roomId;

        App.CurrPlatformUid = this.platformData.token;

        //this.platformData.showAd && this.createAD(this.platformData.adId);
        //统计登陆
        Statistics.open();
        callBack(true);
    }
    private createAD(adId) {
        //初始化广告，必须加载到舞台以后才可以调用
        var aid = adId;
        var ad = new egretad.AD(aid, this);
        console.log("adId:" + aid);
        App.googleAd = ad;
        console.log('广告SDK版本:', egretad.AD.VERSION);
        // this.ad2 = egretad.Manager.getAD('key2');//可以创建更多的广告
        ad.addEventListener(egretad.AD.CREATED, () => {
            var info = '广告创建完成，可以播放';
            console.log(info);
        })
        ad.addEventListener(egretad.AD.LOADED, () => {
            var info = '广告开始加载'
            console.log(info);
        })
        ad.addEventListener(egretad.AD.START, () => {
            var info = '广告开始播放'
            console.log(info);
        })
        ad.addEventListener(egretad.AD.END, () => {
            var info = '广告播放结束'
            //  this.goto ==1?window.location.reload():window.location.reload()
            console.log(info);
        })
        ad.addEventListener(egretad.AD.ERROR, (err) => {
            var info = '广告播放出现错误:' + err;
            console.log(info);
        })
        ad.addEventListener(egretad.AD.CLICK, (err) => {
            var info = '用户点击了广告'
            console.log(info);
        })
    }
    //背景音乐特殊处理
    public dealBgMusic(): void {

    }

    // 游戏结算通知撩站平台前端  "0":无胜负结果,"1":负,"2":平,"3":胜
    public gameOver(value: number): void {
        console.log("游戏结束", value);

        // //返回平台
        // if (egret.getOption("egretnative") !== "true") {
        //     return;
        // }
        // //(1 赢， 2平 0 输)
        // switch (value) {
        //     case 0:
        //     case 1:
        //         window["ExternalInterface"]["call"]("callNativeGameOver", "0");
        //     case 2:
        //         window["ExternalInterface"]["call"]("callNativeGameOver", "2");
        //         break;
        //     case 3:
        //         window["ExternalInterface"]["call"]("callNativeGameOver", "1");
        //         break;
        // }
    }

    invite() {

    }
    loaded() {

    }
}