class Game extends egret.DisplayObjectContainer {
    public layer: egret.DisplayObjectContainer;
    public euiLayer: eui.UILayer;
    public popupLayer: eui.UILayer;
    public isInit: boolean;
    public stateManager: StateManager;

    public sendResultStartTime: number = 0;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAdded, this);
    }

    private instance: any;
    public static getInstance(): Game {
        var self: any = this;
        if (self.instance == null) {
            self.instance = new Game();
        }
        return self.instance;
    }

    private onAdded(e: egret.Event): void {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAdded, this);
        this.initLayer();
        this.init();
    }

    private initLayer(): void {
        this.layer = new egret.DisplayObjectContainer();
        this.addChild(this.layer);

        this.euiLayer = new eui.UILayer();
        this.euiLayer.percentWidth = 100;
        this.euiLayer.percentHeight = 100;
        this.euiLayer.touchEnabled = false;
        this.addChild(this.euiLayer);

        this.popupLayer = new eui.UILayer();
        this.popupLayer.percentWidth = 100;
        this.popupLayer.percentHeight = 100;
        this.popupLayer.touchEnabled = false;
        this.addChild(this.popupLayer);
    }

    private init(): void {
        this.initBgMusic();
        this.initPlatform();
        this.initView();
        this.initMessage();
        this.isInit = true;

        new NetWorkDelayTest();
    }

    private initMessage(): void {
        // ErrCode处理
        App.MessageCenter.addListener(Proto.ID_error_notice_s2c, this.errorS2C, this);
        //收到发送游戏结果
        App.MessageCenter.addListener(EventMessage.SendGameResultC2S, this.onSendGameResultC2S, this);
        //收到发送游戏事件
        App.MessageCenter.addListener(EventMessage.SendGameEventC2S, this.onSendGameEventC2S, this);
        //收到服务器发送的游戏事件
        App.MessageCenter.addListener(Proto.ID_game_event_notice_s2c, this.onReceiveGameEventS2C, this);
        //游戏结果返回
        App.MessageCenter.addListener(Proto.ID_game_result_notice_s2c, this.onReceiveGameResultS2C, this);
        //收到错题反馈
        App.MessageCenter.addListener(EventMessage.AddErrQuestionC2S, this.onAddErrQuestionC2S, this);
        //收到获取题目列表
        App.MessageCenter.addListener(EventMessage.GetQuestionsC2S, this.onGetQuestionsC2S, this);

        App.MessageCenter.addListener(EventMessage.GetDataC2S, this.onGetDataC2S, this);
    }

    private initBgMusic(): void {
        App.SoundManager.setBgOn(true);
        App.SoundManager.setEffectOn(true);
        // App.SoundManager.playBg("BG_mp3");

        Platform.curPlatform.dealBgMusic();
    }

    private initView(): void {
        this.stateManager.setCurStateName("index");
        this.stateManager.startTick();
    }

    private initPlatform(): void {
        this.stateManager = new StateManager(this.layer, this.euiLayer, this.popupLayer);
        this.stateManager.registerState("index", new Index()); //空页面
        this.stateManager.registerState("gamePopup", new GamePopView()); //提示框
        this.stateManager.registerState("GameSureLeave", new GameSureLeaveView()); //游戏确认离开
        this.stateManager.registerState("GameGiveUp", new GameGiveUpView()); //认输面板
        this.stateManager.registerState("GameExpress", new GameExpressTip()); //游戏内的表情发送


        if (Platform.curPlatformID == Platform.XiaoMi) {
            this.stateManager.registerState("GameResult", new GameResultView_XiaoMi()); //游戏结果页面
        } else if (Platform.curPlatformID == Platform.Local) {
            this.stateManager.registerState("gameChangeMatch", new GameChangeMatchView()); //当前已选择游戏等待页面
            this.stateManager.registerState("gameSeach", new GameQuickMatchView()); //匹配页面
            this.stateManager.registerState("GameResult", new GameResultView()); //游戏结果页面
        } else if (Platform.curPlatformID == Platform.FaceBook) {
            this.stateManager.registerState("gameChangeMatch", new GameChangeMatchView()); //当前已选择游戏等待页面
            this.stateManager.registerState("gameSeach", new GameQuickMatchView()); //匹配页面
            this.stateManager.registerState("GameResult", new GameResultView_FaceBook()); //游戏结果页面
        } else if (Platform.curPlatformID == Platform.Wanba || Platform.curPlatformID == Platform.MeiTu) {
            this.stateManager.registerState("GameResult", new GameResultView_Wanba()); //游戏结果页面
        } else if (Platform.curPlatformID == Platform.XiaoMiGame) {
            this.stateManager.registerState("GameResult", new GameResultView_XiaoMi()); //游戏结果页面
        } else if (Platform.curPlatformID == Platform.LiaoZhan || Platform.curPlatformID == Platform.LiaoZhanAbroad || Platform.curPlatformID == Platform.LiaoZhanTest) {
            this.stateManager.registerState("GameResult", new GameResultView_XiaoMi()); //游戏结果页面
        }
    }

    private currGameId: number = 0;
    private getGameClass(stateName: string): any {
        switch (stateName) {
            case "gameKingkong": return GameKingkong;
            case "gameChristmas": return GameChristmasMainView;
            case "gameShooting": return GameShootingView;
            case "gamePigRun": return GamePigRunMainScene;
            case "gameLeonardFrog": return GameLeonardFroG;
            case "gameAnimalChess": return GameAnimalChessView;
            case "gameRhythmKing": return GameRhythmKingMainScene;
            case "gameMasterMind": return GameMasterMindMainScene;
            case "gameBang": return GameBangMainScene;
            case "gameLongJump": return GameLongJumpView;
            case "gameFiveinARow": return GameFiveinARowView;
            case "gameLameDeskmate": return LameDeskmateMainView;
            case "gameTwiceJoy": return GameTwiceJoyMainView;
            case "gameFindSomething": return GameFindSomethingView;
            case "gameGesture": return GameGestureMainScene;
            case "gameGreedy": return GameGreedyPersonView;
            case "gameDormitoryWar": return DormitoryWarMainView;
            case "gameGoBallistic": return GameGoBallisticMainScene;
            case "gameBlockOut": return GameBlockoutView;
        }
    }

    /**
     * 进入游戏
     */
    public joinGame(gameId: number): void {
        //记录当前运行的游戏ID
        this.currGameId = gameId;
        //进入游戏
        var gameConfig: any = DataCenter.instance.getGameConfig(this.currGameId);
        if (!gameConfig) {
            console.error("请先在gameConfig.json中进行配置");
            return;
        }
        var stateName = gameConfig.stateName;
        var cls = this.getGameClass(stateName);
        if (!cls) {
            console.error("请先在gameClassList中进行配置");
            return;
        }
        this.stateManager.registerState(stateName, new cls());
        this.stateManager.curState.next(stateName);
    }

    /**
     * 离开游戏
     */
    public leaveGame(toView: string = "gameChangeMatch"): void {
        if (!this.currGameId) {
            this.stateManager.curState.next(toView);
            return;
        }
        //离开当前运行的游戏
        var gameConfig: any = DataCenter.instance.getGameConfig(this.currGameId);
        var stateName = gameConfig.stateName;
        this.stateManager.unregisterState(stateName);
        this.stateManager.curState.next(toView);
        // 销毁游戏资源
        this.destoryGameRes(this.currGameId);
        // currGameId重置
        this.currGameId = 0;
        // 断开socket
        ProxySocket.stop();
        // 背景音乐停止
        App.SoundManager.stopBg();
    }

    //销毁游戏资源
    public destoryGameRes(gameId: number): void {
        var gameConfig: any = DataCenter.instance.getGameConfig(gameId);
        if (!gameConfig) {
            return;
        }
        // 销毁DB资源
        let dbConfig = RES.getRes("dbAssetConfig_json");
        AssetManager.removeDBAnimation(dbConfig.db[gameId.toString()]);
        // 销毁游戏资源
        RES.destroyRes(gameConfig.res);
    }

    /**
     * 在游戏中
     */
    public isGameing(): boolean {
        return this.currGameId > 0;
    }

    // ErrCode处理
    private errorS2C(data: error_notice_s2c): void {
        // alert("服务端错误码:" + data.errorCode);
    }

    //发送游戏结果
    private onSendGameResultC2S(isWin: number): void {
        // 记录当前时间
        this.sendResultStartTime = egret.getTimer();
        //发送结果
        ProxySocket.sendGameResult(App.CurrRoomId, isWin);
    }

    //收到发送游戏事件
    private onSendGameEventC2S(event: string, sendType: number): void {
        ProxySocket.sendGameEvent(App.CurrRoomId, event, sendType);
    }

    //收到服务器发送的游戏事件
    private onReceiveGameEventS2C(data: game_event_notice_s2c): void {
        data.userId = data.userId.toString()
        App.MessageCenter.dispatch(EventMessage.ReceiveGameEventS2C, data);
    }

    //服务器游戏结果返回
    private onReceiveGameResultS2C(data: game_result_notice_s2c): void {

        let time = egret.getTimer() - this.sendResultStartTime

        console.log("-------服务器游戏结果返回--用时-------> " + time + " 毫秒");
        console.log("----服务器游戏结果返回--数据----" + "消息msgId:-> " + data.msgId
            + "消息winUserId:-> " + data.winUserId + "消息userExitFlag:-> " + data.userExitFlag);

        App.MessageCenter.dispatch(EventMessage.ReceiveGameResultS2C, data);

        //统计
        Statistics.gameEnd();
        Statistics.reportResult(data.winUserId);
    }

    //收到获取题目列表
    private onGetQuestionsC2S(callBack: Function): void {
        ProxyHttp.getQuestions(App.CurrRoomId, (data: any) => {
            callBack(data.data);
        })
    }

    //收到获取数据列表
    private onGetDataC2S(callBack: Function): void {
        ProxyHttp.getData(window["egretGid"], (data: any) => {
            callBack(data.data);
        })
    }

    //收到错题反馈
    private onAddErrQuestionC2S(question: string, callBack: Function): void {

    }
}