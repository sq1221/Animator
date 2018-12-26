class LocalPlatform implements IPlatform {
    public platformData: any;

    public constructor() {
        this.init();
    }

    private init(): void {
        App.CurrGameId = parseInt(window["egretGid"]);
    }

    public login(callBack: Function): void {
        let userIdRandom = App.RandomUtils.limitInteger(10000, 20000).toString();
        //测试参数
        this.platformData = {
            userId: userIdRandom,
            userName: "PK" + userIdRandom,
            userPic: "tou103_png",
            userSex: 1,

            otherUserId: null,
            otherUserName: null,
            otherUserPic: null,
            otherUserSex: null,

            roomId: null,

            isAi: null,
            aiLevel: null,
        }

        callBack(true);
    }

    //背景音乐特殊处理
    public dealBgMusic(): void {
        //iOS设备，背景音乐播放特殊处理
        if (egret.Capabilities.os == "iOS") {
            App.StageUtils.getStage().once(egret.TouchEvent.TOUCH_TAP, () => {
                if (App.SoundManager.bgIsOn) {
                    App.SoundManager.setBgOn(false);
                    App.SoundManager.setBgOn(true);
                }
            }, this);
        }
    }

    // 游戏结算通知小米平台前端  "0":无胜负结果,"1":负,"2":平,"3":胜
    public gameOver(value: number): void {
    }
    invite(callBack: Function) {
        Game.getInstance().stateManager.curState.next("gameSeach");
        Game.getInstance().stateManager.curState["playWaitDB"]();
        Game.getInstance().stateManager.curState["startConnectGameServer"](this.platformData.userId);
    }
    loaded() {

    }
}