class XiaoMiPlatform implements IPlatform {
    public platformData: any;

    public constructor() {
        this.init();
    }

    private init(): void {
        //初始化统计
        Statistics.init("XiaoMi");
        //初始化GameId
        App.CurrGameId = parseInt(window["egretGid"]);

        egret.ExternalInterface.addCallback('CallJsLeaveGame', () => this.onCallJsLeaveGame());
        // if (egret.getOption("egretnative") !== "true") {
        //     return;
        // }
        // window['ExternalInterface']['addCallback']("CallJsLeaveGame", () => {
        //     this.onCallJsLeaveGame();
        // });
    }

    public login(callBack: Function): void {
        //返回数据
        this.platformData = {
            roomId: egret.getOption("roomId"),
            token: egret.getOption("token"),
            ruleId: egret.getOption("ruleId"),
            clientInfo: decodeURIComponent(egret.getOption("clientInfo")),
            gameType: egret.getOption("gameType"),
            gameId: egret.getOption("gameId"),
            extra: egret.getOption("extra")
        }
        App.CurrRoomId = this.platformData.roomId;
        App.CurrPlatformUid = this.platformData.token;
        //统计登陆
        Statistics.open();
        callBack(true);
    }

    //背景音乐特殊处理
    public dealBgMusic(): void {

    }

    // 游戏结算通知小米平台前端  "0":无胜负结果,"1":负,"2":平,"3":胜
    public gameOver(value: number): void {
        egret.ExternalInterface.call('callNativeGameOver', value.toString());
        // if (egret.getOption("egretnative") !== "true") {
        //     return;
        // }
        // switch (value) {
        //     case 0:
        //         window["ExternalInterface"]["call"]("callNativeGameOver", "0");
        //         break;
        //     case 1:
        //         window["ExternalInterface"]["call"]("callNativeGameOver", "1");
        //         break;
        //     case 2:
        //         window["ExternalInterface"]["call"]("callNativeGameOver", "2");
        //         break;
        //     case 3:
        //         window["ExternalInterface"]["call"]("callNativeGameOver", "3");
        //         break;
        // }
    }

    // 游戏中退出
    private onCallJsLeaveGame(): void {
        if (Game.getInstance().isInit) {
            //通知游戏服务器
            Game.getInstance().sendResultStartTime = egret.getTimer()
            ProxySocket.exitGame(App.CurrRoomId);
        } else {
            // 游戏结算通知小米平台前端
            this.gameOver(1);
        }
    }
    invite(callBack: Function) {
    }

    public loaded() {
        App.TimerManager.doFrame(5, 1, () => {
            egret.ExternalInterface.call('callNativeGameLoaded', '');
            // window["ExternalInterface"]["call"]("callNativeGameLoaded","");
        }, this);
    }
}