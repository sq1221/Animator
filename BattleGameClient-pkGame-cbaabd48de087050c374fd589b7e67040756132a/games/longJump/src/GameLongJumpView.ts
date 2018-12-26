class GameLongJumpView extends State {
    static instance: GameLongJumpView;
    private returnToLastButton: egret.Bitmap;
    constructor() {
        super();
        GameLongJumpView.instance = this;
        this.gameLayer = new egret.DisplayObjectContainer();
        this.sceneItemLayer = new egret.DisplayObjectContainer();
        this.moveLayer = new egret.DisplayObjectContainer();
    }
    gameLayer: egret.DisplayObjectContainer;
    sceneItemLayer: egret.DisplayObjectContainer;
    moveLayer: egret.DisplayObjectContainer;

    userController: GameLongJump.UserController;
    platformController: GameLongJump.PlatformController;
    comController: GameLongJump.CompetitorController;
    randomConfig: number[];
    random: Function;
    canJump: boolean;
    stateController: GameLongJump.StateController;
    readyGo: GameLongJump.LongJumpReady;
    result: GameLongJump.GameLongJumpResult;

    init() {
        this.stateController = new GameLongJump.StateController();
        this.stateController.init();
        let i = CommonUtils.hashCodeAbs(DataCenter.instance.room.id) % 10;
        this.randomConfig = RES.getRes("RandomConfig_json")[i];
        if (!DataCenter.instance.room.IsAI) {
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "Map|" + i, 2);
        }

        this.random = new Math["seedrandom"](DataCenter.instance.room.id + "random");
        this.canJump = false;
        let bg = AssetManager.getBitmap("LongJumpBG_png", false, false);
        bg.width = App.GameWidth;
        bg.height = App.GameHeight;
        this.addChild(bg);
        this.moveLayer.addChild(this.sceneItemLayer);
        this.moveLayer.addChild(this.gameLayer);

        this.addChild(this.moveLayer);
        this.comController = new GameLongJump.CompetitorController();
        this.comController.init();
        this.userController = new GameLongJump.UserController();
        this.userController.init();

        this.platformController = new GameLongJump.PlatformController();
        this.platformController.init();
        this.addListener();

        this.addChild(this.stateController);
        this.stateController.x = App.GameWidth / 2;
        this.stateController.y = 90;

        this.readyGo = new GameLongJump.LongJumpReady(() => {
            this.canJump = true;
            if (DataCenter.instance.room.IsAI)
                GameLongJumpView.instance.comController.ai.AItouch();
            this.stateController.timeStart();
            if (!DataCenter.instance.room.IsAI) {
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "readyGoOver", 2);
            }
        });
        this.addChild(this.readyGo);
        this.readyGo.hide();
        this.result = new GameLongJump.GameLongJumpResult();
        this.result.init();

        // 小米平台去掉退出按钮
        if (!App.IsXiaoMi && !App.IsWanba ) {
            this.returnToLastButton = AssetManager.getBitmap("goBack_png", false, false);
            this.returnToLastButton.y = 19;
            this.addChild(this.returnToLastButton);
            this.returnToLastButton.touchEnabled = true;
            this.returnToLastButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                this.popup("GameSureLeave");
            }, this)
        }

        App.SoundManager.stopBg();
        App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);

        let tip2 = AssetManager.getBitmap("longJump_tip_png", false, false);
        tip2.anchorOffsetX = 0;
        tip2.anchorOffsetY = tip2.height;
        tip2.x = 0;
        tip2.y = App.GameHeight - 30;
        this.addChild(tip2);
        App.MessageCenter.addListener(EventMessage.pauseMessage, this.pauseCallback, this);
        if (!DataCenter.instance.room.IsAI) {
            App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "ready", 1);
        } else {
            this.readyGo.play();
        }
    }
    user1Ready = false;
    user2Ready = false;
    start = () => {
        if (this.user1Ready && this.user2Ready)
            this.readyGo.play();
    }
    private onGameEvent(data: any): void {
        /** 
         * "stand|123"
         * command：stand && parameter：123 
         * */
        switch (data.event) {
            case "ready":
                if (data.userId == DataCenter.instance.user.id)
                    this.user1Ready = true;
                else
                    this.user2Ready = true;
                this.start();
                break;
        }
    }
    addListener() {
        this.touchChildren = this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.pressBegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.pressEnd, this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.pressEnd, this)
    }
    private isPressBegin: boolean;
    private pressBegin() {
        if (!this.canJump) return;
        this.isPressBegin = true;
        App.TimerManager.remove(this.touch, this);
        App.TimerManager.doTimer(100, 0, this.touch, this);
        App.SoundManager.playEffect("longJump_powering_mp3", true);
        if (!DataCenter.instance.room.IsAI) {
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "pressBegin", 2);
        }
        this.userController.userCharacter.play("xuli", 1);
    }
    sound = false;
    private touch() {
        if (this.userController.power > GameLongJump.userConfig.powerLimit) {
            if (!this.sound) {
                App.SoundManager.playEffect("longJump_powerLimit_mp3", true, 0);
                this.sound = true;
            }
            return;
        }
        this.userController.power += GameLongJump.userConfig.powerAdd;
    }
    private pressEnd() {
        if (!this.canJump || !this.isPressBegin) return;
        this.isPressBegin = false;
        App.TimerManager.remove(this.touch, this);
        this.userController.jump();
        this.sound = false;
    }
    onGameResult = (data: any): void => {
        DataCenter.instance.room.gameResult = data;
        console.log(DataCenter.instance.room.id + "号房收到结果为" + DataCenter.instance.user.id + ":" + data.winUserId)
        // 发送游戏结果
        /**
         * 将分数抛出去降低耦合度
        */
        if (this.stateController.selfScore >= 60)
            App.MessageCenter.dispatch(EventMessage.leaderboardSetScore, 120 - GameLongJumpView.instance.stateController.time)
        App.TimerManager.doTimer(2000, 1, () => {
            this.popup("GameResult");
        }, this)
    }
    pauseCallback = () => {
        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, 1);
        this.next("gameChangeMatch");
    }
    dispose() {
        super.dispose();
        this.userController.dispose();
        this.platformController.dispose();
        this.comController.dispose();
        this.readyGo.dispose();
        this.result.dispose();
        this.stateController.dispose();
        App.TimerManager.removeAll(this);
        if (!DataCenter.instance.room.IsAI) {
            App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
            App.MessageCenter.removeListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
        }
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.pressBegin, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.pressEnd, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.pressEnd, this)
        App.MessageCenter.removeListener(EventMessage.pauseMessage, this.pauseCallback, this);
    }
}