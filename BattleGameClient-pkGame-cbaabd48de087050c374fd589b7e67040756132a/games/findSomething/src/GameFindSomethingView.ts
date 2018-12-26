class GameFindSomethingView extends StateEui {
    GameScrollerGroup: eui.Group;
    private GameScroller: eui.Scroller;
    gp_bg: eui.Group;
    currentTitleView: eui.Label;
    //分数标记
    private SelfScore1: eui.Image;
    private SelfScore2: eui.Image;
    private ComScore1: eui.Image;
    private ComScore2: eui.Image;
    //个人信息
    private SelfAvatarGroup: eui.Group;
    private SelfName: eui.Label;
    private SelfSex: eui.Image;

    private ComAvatarGroup: eui.Group;
    private ComName: eui.Label;
    private ComSex: eui.Image;
    //当前局的比赛信息
    SelfCurrent: eui.Label;
    ComCurrent: eui.Label;
    Time: eui.Label;
    //乌云
    private leftCloud: eui.Group;
    private rightCloud: eui.Group;
    //功能按钮
    btn_return: eui.Image;
    btn_hello: eui.Image;
    private btn_tip: eui.Image;
    /** 名字最大长度，超过开始缩放 */
    static nameLength = 6;
    /**一局时间限制 */
    static time = 90;
    /** 提示滚屏速度 */
    static scrollerSpeed = 30;
    constructor() {
        super(App.IsWanba ? GameFindSomethingViewSkinWanba : GameFindSomethingViewSkin);
        GameFindSomethingView.instance = this;
        // this.itemLayer = new egret.DisplayObjectContainer();
    }
    static instance: GameFindSomethingView;
    itemController: FindSomeThing.ItemController;
    gameController: FindSomeThing.GameController;
    roundController: FindSomeThing.RoundController;
    scoreController: FindSomeThing.ScoreController;
    aiController: FindSomeThing.AiController;
    private roundBG: egret.Shape;
    private ready: GameReady;
    isGameing = false;
    private tipTitle: eui.Image;

    public static aiConf: any = {};
    init() {
        super.init();
        //注册相关控制器
        this.scoreController = new FindSomeThing.ScoreController(this.SelfCurrent, this.ComCurrent);
        this.roundController = new FindSomeThing.RoundController(this.SelfScore1, this.SelfScore2, this.ComScore1, this.ComScore2);
        this.gameController = new FindSomeThing.GameController(this.leftCloud, this.rightCloud, this.btn_tip, this.tipTitle);
        this.itemController = new FindSomeThing.ItemController();
        this.initUserData();
        if (DataCenter.instance.room.IsAI && App.IsXiaoMi) {
            App.MessageCenter.dispatch(EventMessage.GetDataC2S, (data: any) => {
                GameFindSomethingView.aiConf = data[App.CurrGameAiLevel];
                console.log(`IsXiaoMi${App.CurrGameAiLevel}   ${JSON.stringify(GameFindSomethingView.aiConf)}`);
                this.ready = new GameReady(this.readyStart);
                this.ready.x = 300;
                this.ready.y = App.GameHeight / 2;
                this.addChild(this.ready);
                this.ready.play();
                this.aiController = new FindSomeThing.AiController();
            });
        } else {
            this.ready = new GameReady(this.readyStart);
            this.ready.x = 300;
            this.ready.y = App.GameHeight / 2;
            this.addChild(this.ready);
            this.ready.play();
            if (DataCenter.instance.room.IsAI) {
                this.aiController = new FindSomeThing.AiController();
            }
        }
        //结果返回
        App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
        App.MessageCenter.addListener(EventMessage.GameSendExpress, this.addQiPaoCartoon, this)
        App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);

        if (App.GameHeight < 1136) {
            this.gp_bg.scaleY = this.gp_bg.scaleX = App.GameHeight / 1136
        }
        //回合结束黑屏
        this.roundBG = new egret.Shape();
        this.roundBG.alpha = 0;
        this.roundBG.graphics.beginFill(0x000000);
        this.roundBG.graphics.drawRect(0, 0, App.GameWidth, App.GameHeight);
        this.roundBG.graphics.endFill();
        this.addChild(this.roundBG);

        this.btn_return.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.popup("GameSureLeave");
        }, this)

        if (App.IsXiaoMi || App.IsWanba) {
            this.btn_return.visible = false;
        }

        this.btn_hello.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sayHello, this);


        this.GameScroller.scrollPolicyH = "off";
        App.SoundManager.playBg("FindSomethingBGMusic_mp3");
        switch (App.Language) {
            case LanguageType.Ch:
                this.currentTitleView.text = `第${this.roundController.currentRound}局开始`;
                break;
            case LanguageType.En:
                this.currentTitleView.text = `Round ${this.roundController.currentRound} Start`;
                break;
        }
    }

    readyStart = () => {
        if (DataCenter.instance.room.IsAI) {
            this.aiController.chooseTitle();
            this.aiController.choose();
        }
        this.gameController.chooseTitle();
        this.GameScroller.scrollPolicyH = "on";
        this.isGameing = true;
        App.TimerManager.doTimer(1000, GameFindSomethingView.time, this.countDown, this);
        if (this.gameController.tipNum > 0)
            this.gameController.delayTipTitle();
    }

    initUserData() {
        let self = DataCenter.instance.user;
        let com = DataCenter.instance.room.player;
        var selfHead = new RoleHeadImage(self.imgUrl);
        selfHead.scaleX = selfHead.scaleY = 0.85;
        this.SelfAvatarGroup.addChild(selfHead);

        this.SelfSex.source = GameCenterGetSexIcon.getSexIconSource(self.sex);
        this.SelfName.text = self.name;
        if (this.SelfName.text.length > GameFindSomethingView.nameLength)
            this.SelfName.size *= GameFindSomethingView.nameLength / this.SelfName.text.length;

        var comHead = new RoleHeadImage(com.imgUrl);
        comHead.scaleX = comHead.scaleY = 0.85;
        this.ComAvatarGroup.addChild(comHead);

        this.ComSex.source = GameCenterGetSexIcon.getSexIconSource(com.sex)
        this.ComName.text = com.name;
        if (this.ComName.text.length > GameFindSomethingView.nameLength)
            this.ComName.size *= GameFindSomethingView.nameLength / this.ComName.text.length;
    }
    onGameResult = (data: any): void => {
        // 弹出结果面板
        DataCenter.instance.room.gameResult = data;
        // console.log(DataCenter.instance.room.id + "号房收到结果为" + DataCenter.instance.user.id + ":" + data.winUserId)
        // 发送游戏结果
        this.popup("GameResult");
    }
    private onGameEvent(data: any) {
        let parseData = (data: string): string[] => {
            let splitChar = data.split("|");
            return splitChar;
        }
        let datas = parseData(data.event);
        switch (datas[0]) {
            case "sendExpress":
                this.addQiPaoCartoon(datas[1], 2);
                break;
        }
    }
    addQiPaoCartoon(data, type: number = 1) {
        var qiPao = new QIPaoCartoon();
        qiPao.y = App.RandomUtils.limitInteger(120, 130);
        this.addChild(qiPao);
        if (type == 2) {
            qiPao.x = App.RandomUtils.limitInteger(App.GameWidth - 105, App.GameWidth - 85);
            qiPao.setSouce(data, true);
        }
        else {
            qiPao.setSouce(data);
            qiPao.x = App.RandomUtils.limitInteger(85, 105);
            if (!DataCenter.instance.room.IsAI) {
                var str = "sendExpress|" + data
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, str);
            }
            else {
                var num: number = App.RandomUtils.limitInteger(1, 5);
                if (num % 2 != 0) {
                    App.TimerManager.doTimer(1000 * num, 1, this.AddAIexpress, this);
                }
            }
        }
        qiPao.onPlay();
    }
    //添加Ai的表情
    AddAIexpress() {
        var ArrPress = [
            "1_1", "1_2", "1_3", "1_4", "1_5", "1_6",
            "2_1", "2_2", "2_3", "2_4",
            "3_1", "3_2", "3_3", "3_4"];
        var num: number = App.RandomUtils.limitInteger(0, 13);
        var str: string = "express" + ArrPress[num] + "_png";
        this.addQiPaoCartoon(str, 2);
    }
    sayHello() {
        //打招呼功能在这里写
        App.GameExpressType = 1;
        this.popup("GameExpress");
    }
    nextRound = () => {
        this.isGameing = false;
        this.GameScroller.scrollPolicyH = "off";
        egret.Tween.get(this.roundBG).to({ alpha: 1 }, 300).wait(600).call(() => {
            this.GameScrollerGroup.scrollH = 0;
            this.gameController.nextRound();
            this.itemController.nextRound();
            this.scoreController.nextRound();
            if (DataCenter.instance.room.IsAI)
                this.aiController.nextRound();
            this.time = GameFindSomethingView.time;
            this.Time.text = this.time.toString();
            switch (App.Language) {
                case LanguageType.Ch:
                    this.currentTitleView.text = `第${this.roundController.currentRound}局开始`;
                    break;
                case LanguageType.En:
                    this.currentTitleView.text = `Round ${this.roundController.currentRound} Start`;
                    break;
            }
        }).to({ alpha: 0 }, 300).call(() => {
            this.ready.play();
        });
    }
    private time: number = GameFindSomethingView.time;
    private countDown = () => {
        this.time--;
        this.Time.text = this.time.toString();
        if (this.time == 0) {
            this.scoreController.roundOver();
        }
    }
    stopTime = () => {
        App.TimerManager.remove(this.countDown, this);
    }
    dispose() {
        super.dispose();
        this.itemController.dispose();
        this.gameController.dispose();
        this.roundController.dispose();
        this.scoreController.dispose();
        if (DataCenter.instance.room.IsAI)
            this.aiController.dispose();
        this.ready.dispose();
        egret.Tween.removeTweens(this.roundBG);
        App.TimerManager.removeAll(this);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
        App.MessageCenter.removeListener(EventMessage.GameSendExpress, this.addQiPaoCartoon, this)
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        this.btn_hello.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.sayHello, this);
    }
}