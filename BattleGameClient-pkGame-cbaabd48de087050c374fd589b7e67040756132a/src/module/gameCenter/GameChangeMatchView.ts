/**
 * 游戏匹配
 * by dingyafeng
 */
class GameChangeMatchView extends StateEui {

    public gameItemGroup: eui.Group;// 游戏列表
    public startMatchBtn: eui.Button;// 开始匹配
    public inviteFriendBtn: eui.Button;// 邀请好友
    public goBackBtn: eui.Button;
    public lb_numOnLine: eui.Label;
    public img_icon: eui.Image;
    public img_help: eui.Image;

    public constructor() {
        super(GameChangeMatchSkin);
    }

    public init(): void {
        super.init();
        // 匹配
        this.startMatchBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startMatchBtnHandler, this);
        // 邀请好友
        this.inviteFriendBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.inviteFriendBtnHandler, this);
        //返回游戏
        this.goBackBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBack, this);
        //游戏说明
        this.img_help.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHelp, this);
    }
    showRank(arr: { id: string, name: string, des: string, head: string }[]) {
        if (!FaceBookPlatform.gameData)
            FaceBookPlatform.getFacebookData();
        if (App.IsFaceBook && FaceBookPlatform.gameData.leaderboard) {
            const rankListS = new RankListS();
            rankListS.x = App.GameWidth - 114;
            rankListS.y = 135;
            rankListS.setData(arr);
            this.addChild(rankListS);
        }
    }

    public show(): void {
        super.show();

        var data: GameConfig = DataCenter.instance.getGameConfig(App.CurrGameId);
        // this.lb_numOnLine.text = data.playerNum + "对在玩";
        this.img_icon.source = data.icon;
        if (App.IsFaceBook)
            FaceBookPlatform.getFriend();
    }

    public tick(advancedTime: number): void {
        super.tick(advancedTime);
    }

    public dispose(): void {
        super.dispose();
    }

    public onBack() {
        App.SoundManager.playEffect("mouseClickSound_mp3");
        this.next("gameIndex");
    }

    public onHelp() {
        // App.SoundManager.playEffect("mouseClickSound_mp3");
        // this.popup("GameExplainView");
    }


    public addMesssgaeListener(): void {
        super.addMesssgaeListener();
        // 请求匹配返回
        App.MessageCenter.addListener(Proto.ID_game_matching_s2c, this.successMatchingS2C, this);
        //Socket连接成功消息
        App.MessageCenter.addListener(SocketConst.SOCKET_CONNECT, this.connectSocketSuccess, this);
        App.MessageCenter.addListener(SocketConst.SOCKET_CLOSE, this.connectSocketClose, this);
        App.MessageCenter.addListener(SocketConst.SOCKET_NOCONNECT, this.connectSocketError, this);
    }

    //开启连接匹配服务器
    private startConnectMatchingServer(): void {
        var userId = Platform.curPlatform.platformData.userId;
        ProxyHttp.getGameServer(userId, (data) => {
            var connectorServer = data.data;
            if (!connectorServer.hasOwnProperty("useSSL")) {
                connectorServer.useSSL = true;
            }
            ProxySocket.init(connectorServer.host, connectorServer.port, connectorServer.useSSL);

            Common.ServerIndex = connectorServer.sindex;
        })
    }

    //连接关闭
    private connectSocketClose() {
        var errMsg: string = RES.getRes("errorCode_json")["6001"];
        Common.showErrorMsg_Game(errMsg);
    }

    //连接失败
    private connectSocketError() {
        var errMsg: string = RES.getRes("errorCode_json")["6002"];
        Common.showErrorMsg_Game(errMsg);
    }

    //连接Socket服务器成功，进行登录
    private connectSocketSuccess(): void {
        //开启ping
        ProxySocket.startPing();
        //请求匹配
        let myData = Platform.curPlatform.platformData;
        let userId = myData.userId;
        let userName = myData.userName;
        let userPic = myData.userPic;
        let userSex = myData.userSex;
        ProxySocket.startMatching(App.CurrGameId, userId, userName, userPic, userSex);
    }

    //匹配成功返回
    private successMatchingS2C(data: game_matching_s2c): void {
        // 跳转页面
        this.next("gameSeach");
    }

    // 开始匹配
    private startMatchBtnHandler(e: TouchEvent): void {
        App.SoundManager.playEffect("mouseClickSound_mp3");
        this.startConnectMatchingServer()
    }
    // 邀请好友
    private inviteFriendBtnHandler(e: TouchEvent): void {
        App.SoundManager.playEffect("mouseClickSound_mp3");
        Platform.curPlatform.invite(() => {
            //切换到匹配页面
            Game.getInstance().stateManager.curState.next("gameSeach");
            Game.getInstance().stateManager.curState["playWaitDB"]();
            Game.getInstance().stateManager.curState["startConnectGameServer"](App.CurrRoomId);
        });
    }
}