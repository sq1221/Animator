class XiaoMiGamePlatform implements IPlatform {
    public platformData: any;

    public constructor() {
        this.init();
    }

    private init(): void {
        //初始化统计
        Statistics.init("XiaoMiGame");
        //初始化GameId
        App.CurrGameId = parseInt(window["egretGid"]);
    }

    public login(callBack: Function): void {
        //返回数据
        this.platformData = {
            roomId: egret.getOption("roomId"),
            token: egret.getOption("token"),
            gameId: egret.getOption("gameId"),
        }

        {
            //测试数据
            if (this.platformData.roomId.length == 0) {
                this.platformData.roomId = "967dddd9d9d01a8416885d3563be1b28";
                this.platformData.token = "a-HVbCnlCCfdVY8_eFtJznzwIitER0SxPcU8SleaGFK6hkQnIwzaOHaHqmSczx_dJp30lqe8BrLHbglafLzpgga8K8z_WOYJmTZRCxQWbEg.";
                this.platformData.gameId = "80000002";
            }
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

    }
    invite(callBack: Function) {

    }
    public loaded() {
        App.TimerManager.doFrame(5, 1, () => {
            window["ExternalInterface"]["call"]("callNativeGameLoaded", "");
        }, this);
    }
}