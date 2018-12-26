class WanbaPlatform implements IPlatform {
    public platformData: any;

    public constructor() {
        this.init();
    }

    private init(): void {
        //初始化统计
        Statistics.init("wanba");
        //初始化GameId
        App.CurrGameId = parseInt(window["egretGid"]);
    }

    public login(callBack: Function): void {
        //返回数据
        this.platformData = {
            roomId: egret.getOption("battle_id"),
            group_num: egret.getOption("group_num"),
            group_id: egret.getOption("group_id"),
        }
        App.CurrPlatformUid = this.platformData.token;

        //玩吧登录
        wanba.login(this.platformData, (data) => {
            this.platformData = data;
            console.log(data);

            App.CurrRoomId = this.platformData.roomId;
            App.CurrPlatformUid = this.platformData.openid;
            //统计登陆
            Statistics.open();

            callBack(true);
        });
    }

    //背景音乐特殊处理
    public dealBgMusic(): void {

    }

    // 游戏结算通知平台前端  "0":无胜负结果,"1":负,"2":平,"3":胜
    public gameOver(value: number): void {
        wanba.setUserGameData();
    }
    invite(callBack: Function){
        
    }
    loaded() {

    }
}