class LiaoZhanTestPlatform implements IPlatform {
    public platformData: any;

    public constructor() {
        this.init();
    }

    private init(): void {
        //初始化统计
        Statistics.init("LiaoZhanTest");
        //初始化GameId
        App.CurrGameId = parseInt(window["egretGid"]);

        //游戏中退出
        egret.ExternalInterface.addCallback("onCallJsLeaveGame", this.onCallJsLeaveGame);
    }

    public login(callBack: Function): void {
        //返回数据
        this.platformData = {
            roomId: egret.getOption("roomId"),
            appId: egret.getOption("appId"),
            token: egret.getOption("token")
        }

        // {
        //     //测试数据
        //     if (this.platformData.roomId.length == 0) {
        //         this.platformData.roomId = "967dddd9d9d01a8416885d3563be1b28";
        //         this.platformData.token = "a-HVbCnlCCfdVY8_eFtJznzwIitER0SxPcU8SleaGFK6hkQnIwzaOHaHqmSczx_dJp30lqe8BrLHbglafLzpgga8K8z_WOYJmTZRCxQWbEg.";
        //         this.platformData.gameId = "80000002";
        //     }
        // }

        App.CurrRoomId = this.platformData.roomId;
        App.CurrPlatformUid = this.platformData.token;
        //统计登陆
        Statistics.open();
        callBack(true);
    }

    //背景音乐特殊处理
    public dealBgMusic(): void {

    }
    // 游戏中退出
    private onCallJsLeaveGame(): void {
        if (Game.getInstance().isInit) {
            // Game.getInstance().stateManager.curState.popup("GameSureLeave");

            // 背景音乐停止
            App.SoundManager.stopBg();
            // 发送退出游戏事件
            App.MessageCenter.dispatch(EventMessage.GameLeave);
            // 退出游戏 socket是否连接
            if (!App.Socket.isConnecting()) {
                Game.getInstance().leaveGame();
            } else {
                ProxySocket.exitGame(App.CurrRoomId);
            }
        } else {
        }
    }
    // 游戏结算通知撩站平台前端  "0":无胜负结果,"1":负,"2":平,"3":胜,"4":错误
    public gameOver(value: number): void {
        console.log("游戏结束", value);
        egret.ExternalInterface.call("gameOver", value.toString());
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