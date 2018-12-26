class GameAnimalChessView extends State {
    userController: AnimalChess.UserController;
    chessboardController: AnimalChess.ChessboardController;
    private chiji: DBArmature;
    static instance: GameAnimalChessView;
    static random: Function;
    constructor() {
        super();
        this.userController = new AnimalChess.UserController();
        this.chessboardController = new AnimalChess.ChessboardController();
        this.tipController = new AnimalChess.TipController();
        this.gameLayer = new egret.DisplayObjectContainer();
        this.UILayer = new egret.DisplayObjectContainer();
        GameAnimalChessView.instance = this;
    }
    init() {
        super.init();
      
        
        GameAnimalChessView.random = new Math["seedrandom"](DataCenter.instance.room.id.toString());
        
       
        this.viewInit();
        this.adapt();
        this.tipController.width = App.GameWidth;
        this.tipController.height = App.GameHeight;
        this.tipController.init();

        this.chessboardController.chessboardInit();
        this.userController.init();
        this.addChild(this.tipController);
        App.SoundManager.stopBg();
        var str = "animal_bg_mp3"
        App.SoundManager.playBg(str);
        //结果返回
        App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);

        App.MessageCenter.addListener(EventMessage.GameSendExpress, this.addQiPaoCartoon, this)
        App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        App.MessageCenter.addListener(EventMessage.pauseMessage, this.pauseCallback, this);
    }
    pauseCallback = () => {
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, 1);
        this.next("gameChangeMatch");
    }
    onGameResult = (data: any): void => {
        // 弹出结果面板
        DataCenter.instance.room.gameResult = data;
        console.log(DataCenter.instance.room.id + "号房收到结果为" + DataCenter.instance.user.id + ":" + data.winUserId)
        let resultPageFun = () => {
            App.MessageCenter.dispatch(EventMessage.gameCloseGiveUp);
            let delayTime: number = 2000;
            if (data.winUserId == DataCenter.instance.user.id) {
                this.tipController.showChiji(delayTime)
                //播放胜利声
                var str = "animal_win_mp3";
                App.SoundManager.playEffect(str);
            } else if (data.winUserId == DataCenter.instance.room.player.id) {
                if (!this.tipController.isGiveUp) {
                    this.tipController.showFailure(delayTime)
                } else {
                    delayTime = 0;
                }
                //播放失败声
                var str = "animal_lose_mp3"
                App.SoundManager.playEffect(str);
            } else {
                this.tipController.showDrawn(delayTime)
            }
            this.chiji.play("winjiazi", 0);
            App.SoundManager.stopBg();
            App.TimerManager.doTimer(delayTime, 1, () => {
                DataCenter.instance.room.gameResult = data;
                this.popup("GameResult");
                this.over();
            }, this)
        }
        // 发送游戏结果
        this.popup("GameResult", resultPageFun);
    }
    gameLayer: egret.DisplayObjectContainer;
    UILayer: egret.DisplayObjectContainer;
    tipController: AnimalChess.TipController;
    private returnToLastButton: egret.Bitmap;
    static scale: number;
    private viewInit = () => {
        this.initBackground();
        this.gameLayer.width = 604 * GameAnimalChessView.scale;
        this.gameLayer.height = 668 * GameAnimalChessView.scale;
        this.gameLayer.anchorOffsetX = this.gameLayer.width / 2;
        this.gameLayer.anchorOffsetY = this.gameLayer.height / 2;
        this.gameLayer.x = App.GameWidth / 2;
        this.gameLayer.y = this.backgroundMain.y + this.backgroundMain.height / 2;
        this.addChild(this.gameLayer);

        this.UILayer.height = App.GameHeight;
        this.UILayer.anchorOffsetY = this.UILayer.height / 2;
        this.UILayer.y = App.GameHeight / 2;
        this.addChild(this.UILayer);

        // 小米平台去掉退出按钮
        if (!App.IsXiaoMi && !App.IsWanba) {
            this.returnToLastButton = AssetManager.getBitmap("goBack_png", false, false);
            this.returnToLastButton.y = 19;
            this.UILayer.addChild(this.returnToLastButton);

            this.returnToLastButton.touchEnabled = true;
            this.returnToLastButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                this.popup("GameSureLeave");
            }, this)
        }

        this.chiji = AssetManager.getDBArmature("chiji");
        this.chiji.scaleX = this.chiji.scaleY = GameAnimalChessView.scale;
        this.chiji.x = App.GameWidth / 2;
        this.chiji.y = 150 * GameAnimalChessView.scale;
        this.UILayer.addChild(this.chiji);
        this.chiji.play("dong", 0);

        let animalRank = AssetManager.getBitmap("animalRank_png");
        animalRank.width *= GameAnimalChessView.scale;
        animalRank.height *= GameAnimalChessView.scale;
        while (animalRank.width > App.GameWidth) {
            animalRank.width *= 0.95;
            animalRank.height *= 0.95;
        }
        animalRank.anchorOffsetX = animalRank.width / 2;
        animalRank.anchorOffsetY = animalRank.height / 2;
        animalRank.x = App.GameWidth / 2;
        animalRank.y = 947 * GameAnimalChessView.scale;
        this.UILayer.addChild(animalRank);

        let black1 = AssetManager.getBitmap("animal_blackMask_png");
        black1.width = App.GameWidth;
        black1.height = (App.GameHeight - this.backgroundMain.height) / 2;
        black1.anchorOffsetY = black1.height;
        black1.anchorOffsetX = black1.width / 2;
        black1.x = App.GameWidth / 2;
        black1.y = 0;
        this.addChild(black1);

        let black2 = AssetManager.getBitmap("animal_blackMask_png");
        black2.width = App.GameWidth;
        black2.height = (App.GameHeight - this.backgroundMain.height) / 2;
        black2.anchorOffsetY = black2.height;
        black2.anchorOffsetX = black2.width / 2;
        black2.x = App.GameWidth / 2;
        black2.y = App.GameHeight - (App.GameHeight - this.backgroundMain.height) / 2;
        this.addChild(black2);

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
    backgroundMain: egret.Bitmap;
    initBackground = () => {
        let backgroundTop = AssetManager.getBitmap("animalTop_png", false, false);
        backgroundTop.width = App.GameWidth;
        backgroundTop.anchorOffsetX = backgroundTop.width / 2;
        backgroundTop.x = App.GameWidth / 2;
        this.addChild(backgroundTop);

        let backgroundTopLeft = AssetManager.getBitmap("animalTopLeft_png", false, false);
        backgroundTopLeft.x = 0;
        this.addChild(backgroundTopLeft);

        let backgroundTopRight = AssetManager.getBitmap("animalTopRight_png", false, false);
        backgroundTopRight.x = App.GameWidth - backgroundTopRight.width;
        this.addChild(backgroundTopRight);

        this.backgroundMain = AssetManager.getBitmap("animalMain_png", false, false);
        if (App.GameHeight < this.backgroundMain.height) {
            GameAnimalChessView.scale = App.GameHeight / this.backgroundMain.height;
            this.backgroundMain.height = App.GameHeight;
        }
        else
            GameAnimalChessView.scale = 1;
        this.backgroundMain.width = App.GameWidth * GameAnimalChessView.scale;
        this.backgroundMain.anchorOffsetX = this.backgroundMain.width / 2;
        this.backgroundMain.x = App.GameWidth / 2;

        let backgroundLeft = AssetManager.getBitmap("animalLeft_png", false, false);
        backgroundLeft.anchorOffsetX = backgroundLeft.width;
        backgroundLeft.x = (App.GameWidth - this.backgroundMain.width) / 2;
        backgroundLeft.height = App.GameHeight;
        this.addChild(backgroundLeft);

        let backgroundRight = AssetManager.getBitmap("animalRight_png", false, false);
        backgroundRight.x = App.GameWidth - (App.GameWidth - this.backgroundMain.width) / 2;
        backgroundRight.height = App.GameHeight;
        this.addChild(backgroundRight);

        this.addChild(this.backgroundMain);

        let board = AssetManager.getBitmap("animalBoard_png");
        board.width *= GameAnimalChessView.scale;
        board.height *= GameAnimalChessView.scale;
        board.anchorOffsetX = board.width;
        board.anchorOffsetY = board.height;
        board.x = App.GameWidth - 10;
        board.y = 150 * GameAnimalChessView.scale;
        this.addChild(board);
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

    over() {
        this.userController.dispose();
        this.chessboardController.dispose();
        //通知UI更新
        App.MessageCenter.dispatch(EventMessage.gameCloseExpress);
        GameAnimalChessView.instance = null;
    }
    /**适配IphoneX */
    adapt() {
        if (App.GameHeight > this.backgroundMain.height)
            this.y = (App.GameHeight - this.backgroundMain.height) / 2;
    }
    dispose() {
        super.dispose();
        this.chessboardController.dispose();
        this.userController.dispose();
        this.tipController.dispose();
        App.TimerManager.removeAll(this);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
        App.MessageCenter.removeListener(EventMessage.GameSendExpress, this.addQiPaoCartoon, this)
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        App.MessageCenter.removeListener(EventMessage.pauseMessage, this.pauseCallback, this);
    }
}