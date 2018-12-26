class GameGestureMainScene extends State {
    private panel = new GesturePanel();
    static instance: GameGestureMainScene;
    static gesturePanel: GameGestureItemMaker;

    private teachMask: egret.Bitmap;
    private teachV: egret.Bitmap;
    private teachDelta: egret.Bitmap;
    private finger: egret.Bitmap;

    private dishes1: egret.Bitmap;
    private dishes2: egret.Bitmap;
    private dishes3: egret.Bitmap;

    private AiConf = {};

    public rdy = new GameReady(() => {
        this.teach();
    });

    public constructor() {
        super();
        GameGestureMainScene.instance = this;

        if (App.IsXiaoMi) {
            App.MessageCenter.dispatch(EventMessage.GetDataC2S, (data: any) => {
                GameGestureMainScene.instance.AiConf = data;
                let conf = GameGestureMainScene.instance.AiConf[App.CurrGameAiLevel];
                GameGestureItemClass.AiSuccess = conf.s;
                GameGestureItemClass.autonomy = conf.a;
                console.log(">>>>> conf :", conf.s, conf.a);
            });
        }
    }

    init() {
        super.init();

        if (DataCenter.instance.room.IsAI == true) {
            GameGestureItemClass.isOffline = true;
        } else {
            GameGestureItemClass.isOffline = false;
        }

        App.SoundManager.stopBg();
        App.SoundManager.playBg("GT_bgm_mp3");

        GameGestureItemClass.soundWay_1 = new SoundEffects();
        GameGestureItemClass.soundWay_1.setVolume(0.8);
        GameGestureItemClass.soundWay_2 = new SoundEffects();
        GameGestureItemClass.soundWay_2.setVolume(0.8);
        GameGestureItemClass.soundWay_3 = new SoundEffects();
        GameGestureItemClass.soundWay_3.setVolume(0.8);

        egret.lifecycle.onPause = () => {
            App.SoundManager.setBgOn(false);
            App.SoundManager.setEffectOn(false);
            console.log("PAUSE!");
            if (GameGestureItemClass.soundWay_1) {
                GameGestureItemClass.soundWay_1.setVolume(0);
            }
            if (GameGestureItemClass.soundWay_2) {
                GameGestureItemClass.soundWay_2.setVolume(0);
            }
            if (GameGestureItemClass.soundWay_3) {
                GameGestureItemClass.soundWay_3.setVolume(0);
            }
        }

        egret.lifecycle.onResume = () => {
            App.SoundManager.setBgOn(true);
            App.SoundManager.setEffectOn(true);
            console.log("RESUME!");
            if (GameGestureItemClass.soundWay_1) {
                GameGestureItemClass.soundWay_1.setVolume(0.8);
            }
            if (GameGestureItemClass.soundWay_2) {
                GameGestureItemClass.soundWay_2.setVolume(0.8);
            }
            if (GameGestureItemClass.soundWay_3) {
                GameGestureItemClass.soundWay_3.setVolume(0.8);
            }
        }

        this.gameInit();
    }

    dispose() {
        egret.stopTick(GameGestureLogic.readyTick, GameGestureMainScene.instance);
        egret.stopTick(GameGestureLogic.mainTick, GameGestureMainScene.instance);

        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, GameGestureEventClass.messageReceiveCenter, GameGestureMainScene.instance);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameResultS2C, GameGestureEventClass.resultMessageCenter, GameGestureMainScene.instance);
        App.TimerManager.removeAll(GameGestureMainScene.instance);
        App.TimerManager.removeAll(GameGestureMainScene.gesturePanel);
        //GameGestureAutonomy.instance.stop();
        GameGestureMainScene.gesturePanel.stop();
        this.panel.dispose(GameGestureItemClass.backGround);

        egret.Tween.removeAllTweens();

        GameGestureItemClass.dispose();

        App.SoundManager.stopBg();

        GameGestureMainScene.instance = undefined;
        GameGestureMainScene.gesturePanel = undefined;

        for (let index = 0; index < GameGestureItemClass.itemList.length; index++) {
            GameGestureItemClass.itemList[index].dispose();
        }

        GameGestureItemClass.itemList = [];

        super.dispose();
    }

    private getSType = (who: number): egret.Bitmap => {
        let SexIcon: number = 0;

        let getIcon = (sexType: number) => {
            switch (sexType) {
                case 1:
                    SexIcon = 1;
                    break;
                case 2:
                    SexIcon = 2;
                    break;
                default:
                    SexIcon = 1;
                    break;
            }
        }
        switch (who) {
            case 0:
                getIcon(DataCenter.instance.user.sex);
                break;
            case 1:
                getIcon(DataCenter.instance.room.player.sex);
                break;
        }

        switch (SexIcon) {
            case 1:
                return AssetManager.getBitmap("img_boy_png", false, false);
            case 2:
                return AssetManager.getBitmap("img_gril_png", false, false);
        }
    }

    public teach = () => {
        this.teachMask = AssetManager.getBitmap("GT_mask_png", false, false);
        this.teachMask.x = 0;
        this.teachMask.y = 0;
        this.teachMask.alpha = 0.3;
        this.addChildAt(this.teachMask, 21);
        console.log("teach!");

        this.teachV = AssetManager.getBitmap("GT_teachV_png");
        this.teachV.x = 320;
        this.teachV.y = 700;
        this.addChildAt(this.teachV, 22);

        this.finger = AssetManager.getBitmap("GT_finger_png", false, false);
        this.finger.anchorOffsetX = 27;
        this.finger.anchorOffsetY = 22;
        this.finger.x = 231;
        this.finger.y = 629;
        this.addChildAt(this.finger, 23);

        let twV = egret.Tween.get(this.finger, { loop: true });
        twV.to({ x: 321, y: 774 }, 900).to({ x: 417, y: 629 }, 900).call(() => {
            this.finger.x = 231;
            this.finger.y = 629;
        });

        GameGestureMainScene.gesturePanel.itemMakeOne(1, 1);

        App.TimerManager.doTimer(3000, 1, () => {
            egret.Tween.removeTweens(this.finger);
            this.removeChild(this.finger);
            this.removeChild(this.teachV);

            this.teachDelta = AssetManager.getBitmap("GT_teachDelta_png");
            this.teachDelta.x = 320;
            this.teachDelta.y = 700;
            this.addChildAt(this.teachDelta, 22);

            this.finger = AssetManager.getBitmap("GT_finger_png", false, false);
            this.finger.anchorOffsetX = 27;
            this.finger.anchorOffsetY = 22;
            this.finger.x = 324;
            this.finger.y = 624;
            this.addChildAt(this.finger, 23);

            let twV = egret.Tween.get(this.finger, { loop: true });
            twV.to({ x: 227, y: 789 }, 900).to({ x: 419, y: 789 }, 900).to({ x: 324, y: 624 }, 900).call(() => {
                this.finger.x = 324;
                this.finger.y = 624;
            });

            GameGestureMainScene.gesturePanel.itemMakeOne(1, 2);

            App.TimerManager.doTimer(3000, 1, () => {
                egret.Tween.removeTweens(this.finger);
                this.removeChild(this.finger);
                this.removeChild(this.teachMask);
                this.removeChild(this.teachDelta);
                console.log("teach over!");
                GameGestureMainScene.gesturePanel.start();
                console.log("maker now is running!");
            }, GameGestureMainScene.instance);
        }, GameGestureMainScene.instance);
    }

    private gameInit = () => {
        App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, GameGestureEventClass.messageReceiveCenter, GameGestureMainScene.instance);
        App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, GameGestureEventClass.resultMessageCenter, GameGestureMainScene.instance);
        GameGestureMainScene.gesturePanel = new GameGestureItemMaker();

        if (!App.IsXiaoMi) {
            switch (App.CurrGameAiLevel) {
                case 1:
                    GameGestureItemClass.AiSuccess = 0.72;
                    GameGestureItemClass.autonomy = 1500;
                    break;
                case 2:
                    GameGestureItemClass.AiSuccess = 0.78;
                    GameGestureItemClass.autonomy = 1800;
                    break;
                case 3:
                    GameGestureItemClass.AiSuccess = 0.84;
                    GameGestureItemClass.autonomy = 2100;
                    break;
                case 4:
                    GameGestureItemClass.AiSuccess = 0.9;
                    GameGestureItemClass.autonomy = 2400;
                    break;
                case 5:
                    GameGestureItemClass.AiSuccess = 0.95;
                    GameGestureItemClass.autonomy = 3000;
                    break;
            }
        }

        egret.startTick(GameGestureLogic.readyTick, GameGestureMainScene.instance);

        GameGestureItemClass.backGround = AssetManager.getBitmap("GT_backGround_jpg", false, false);
        GameGestureItemClass.backGround.x = 0;
        GameGestureItemClass.backGround.y = 0;
        GameGestureItemClass.backGround.touchEnabled = true;
        this.addChildAt(GameGestureItemClass.backGround, 1);

        GameGestureItemClass.desk = AssetManager.getBitmap("GT_desk_png", false, false);
        GameGestureItemClass.desk.anchorOffsetY = GameGestureItemClass.desk.height;
        GameGestureItemClass.desk.x = 0;
        GameGestureItemClass.desk.y = 1136;
        this.addChildAt(GameGestureItemClass.desk, 2);

        this.addChildAt(GameGestureMainScene.gesturePanel, 3);

        GameGestureItemClass.backGroundLight = AssetManager.getBitmap("GT_backGroundLight_png", false, false);
        GameGestureItemClass.backGroundLight.x = 0;
        GameGestureItemClass.backGroundLight.y = 0;
        this.addChildAt(GameGestureItemClass.backGroundLight, 4);

        GameGestureItemClass.headIcoLeft = new RoleHeadImage(DataCenter.instance.user.imgUrl, "tou_png", 84, 84);
        GameGestureItemClass.headIcoLeft.x = 89;
        GameGestureItemClass.headIcoLeft.y = 17;
        this.addChildAt(GameGestureItemClass.headIcoLeft, 5);

        GameGestureItemClass.headIcoRight = new RoleHeadImage(DataCenter.instance.room.player.imgUrl, "tou_png", 84, 84);
        GameGestureItemClass.headIcoRight.x = 495;
        GameGestureItemClass.headIcoRight.y = 17;
        this.addChildAt(GameGestureItemClass.headIcoRight, 6);

        GameGestureItemClass.ScoreColumn = AssetManager.getBitmap("GT_scoreColumn_png", false, false);
        GameGestureItemClass.ScoreColumn.x = 88;
        GameGestureItemClass.ScoreColumn.y = 16;
        this.addChildAt(GameGestureItemClass.ScoreColumn, 7);

        GameGestureItemClass.leftHealthCtrlor = new healthCtrlor("left");
        GameGestureItemClass.leftHealthCtrlor.x = 199;
        GameGestureItemClass.leftHealthCtrlor.y = 61;
        this.addChildAt(GameGestureItemClass.leftHealthCtrlor, 8);

        GameGestureItemClass.rightHealthCtrlor = new healthCtrlor("right");
        GameGestureItemClass.rightHealthCtrlor.x = 372;
        GameGestureItemClass.rightHealthCtrlor.y = 61;
        this.addChildAt(GameGestureItemClass.rightHealthCtrlor, 9);

        let leftSexTypeIcon = this.getSType(0);
        leftSexTypeIcon.x = 176;
        leftSexTypeIcon.y = 25;
        this.addChildAt(leftSexTypeIcon, 10);

        let rightSexTypeIcon = this.getSType(1);
        rightSexTypeIcon.x = 463;
        rightSexTypeIcon.y = 25;
        this.addChildAt(rightSexTypeIcon, 11);

        let leftName = new egret.TextField();
        leftName.width = 110;
        leftName.height = 16;
        leftName.size = 16;
        leftName.x = 209;
        leftName.y = 30;
        leftName.textColor = 0xffffff;
        leftName.textAlign = egret.HorizontalAlign.LEFT;
        leftName.verticalAlign = egret.VerticalAlign.MIDDLE;
        leftName.text = DataCenter.instance.user.name;
        this.addChildAt(leftName, 12);

        let rightName = new egret.TextField();
        rightName.width = 110;
        rightName.height = 16;
        rightName.size = 16;
        rightName.x = 344;
        rightName.y = 30;
        rightName.textColor = 0xffffff;
        rightName.textAlign = egret.HorizontalAlign.RIGHT;
        rightName.verticalAlign = egret.VerticalAlign.MIDDLE;
        rightName.text = DataCenter.instance.room.player.name;
        this.addChildAt(rightName, 13);

        this.dishes1 = AssetManager.getBitmap("GT_dish_png", false, false);
        this.dishes1.x = 66;
        this.dishes1.y = 1066;
        this.dishes1.anchorOffsetY = this.dishes1.height;
        this.addChildAt(this.dishes1, 14);

        this.dishes2 = AssetManager.getBitmap("GT_dish_png", false, false);
        this.dishes2.x = 256;
        this.dishes2.y = 1066;
        this.dishes2.anchorOffsetY = this.dishes2.height;
        this.addChildAt(this.dishes2, 15);

        this.dishes3 = AssetManager.getBitmap("GT_dish_png", false, false);
        this.dishes3.x = 450;
        this.dishes3.y = 1066;
        this.dishes3.anchorOffsetY = this.dishes3.height;
        this.addChildAt(this.dishes3, 16);

        GameGestureItemClass.foodLeft = AssetManager.getBitmap("GT_foodLeft_png", false, false);
        GameGestureItemClass.foodLeft.anchorOffsetY = GameGestureItemClass.foodLeft.height;
        GameGestureItemClass.foodLeft.y = 1066;
        GameGestureItemClass.foodLeft.x = 66;
        GameGestureItemClass.foodLeft.name = "food3";
        this.addChildAt(GameGestureItemClass.foodLeft, 17);

        GameGestureItemClass.foodMid = AssetManager.getBitmap("GT_foodMid_png", false, false);
        GameGestureItemClass.foodMid.anchorOffsetY = GameGestureItemClass.foodMid.height;
        GameGestureItemClass.foodMid.y = 1066;
        GameGestureItemClass.foodMid.x = 256;
        GameGestureItemClass.foodMid.name = "food1";
        this.addChildAt(GameGestureItemClass.foodMid, 18);

        GameGestureItemClass.foodRight = AssetManager.getBitmap("GT_foodRight_png", false, false);
        GameGestureItemClass.foodRight.anchorOffsetY = GameGestureItemClass.foodRight.height;
        GameGestureItemClass.foodRight.y = 1066;
        GameGestureItemClass.foodRight.x = 450;
        GameGestureItemClass.foodRight.name = "food2";
        this.addChildAt(GameGestureItemClass.foodRight, 19);

        GameGestureItemClass.otherLine = AssetManager.getBitmap("GT_lLine_png", false, false);
        GameGestureItemClass.otherLine.x = 0;
        GameGestureItemClass.otherLine.y = -100;
        GameGestureItemClass.otherLine.alpha = 0;
        this.addChildAt(GameGestureItemClass.otherLine, 20);

        let leftSide = AssetManager.getBitmap("GT_mask_png", false, false);
        leftSide.anchorOffsetX = 640;
        leftSide.anchorOffsetY = 0;
        leftSide.x = 0;
        leftSide.y = 0;
        this.addChildAt(leftSide, 25);

        let rightSide = AssetManager.getBitmap("GT_mask_png", false, false);
        rightSide.anchorOffsetX = 0;
        rightSide.anchorOffsetY = 0;
        rightSide.x = 640;
        rightSide.y = 0;
        this.addChildAt(rightSide, 26);

        let topSide = AssetManager.getBitmap("GT_mask_png", false, false);
        topSide.anchorOffsetX = 0;
        topSide.anchorOffsetY = 1136;
        topSide.x = 0;
        topSide.y = 0;
        this.addChildAt(topSide, 27);

        let botSide = AssetManager.getBitmap("GT_mask_png", false, false);
        botSide.anchorOffsetX = 0;
        botSide.anchorOffsetY = 0;
        botSide.x = 0;
        botSide.y = 1136;
        this.addChildAt(botSide, 28);

        this.panel.init();
        this.panel.width = 640;
        this.panel.height = 1136;
        this.panel.x = 0;
        this.panel.y = 0;
        this.panel.addEvent(GameGestureItemClass.backGround);
        this.addChildAt(this.panel, 24);

        // 小米平台去掉退出按钮
        if (!App.IsXiaoMi && !App.IsWanba) {
            let returnToLastButton = AssetManager.getBitmap("goBack_png", false, false);
            returnToLastButton.y = 19;
            returnToLastButton.name = "backBtn";
            this.addChild(returnToLastButton);
            returnToLastButton.touchEnabled = true;
            returnToLastButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                this.popup("GameSureLeave");
            }, this);
        }

        if (this.stage.stageHeight < 1136) {
            GameGestureItemClass.multiple = (this.stage.stageHeight / 1136);
            this.scaleX = GameGestureItemClass.multiple;
            this.scaleY = GameGestureItemClass.multiple;
            let nowWidth = 640 * GameGestureItemClass.multiple;
            this.x = (640 - nowWidth) / 2;
            GameGestureItemClass.isLocal = true;
        } else if (this.stage.stageHeight > 1136) {
            this.y = (this.stage.stageHeight - 1136) / 2;
            this.panel.y -= this.y;
            GameGestureItemClass.isLocal = false;
        }

        switch (GameGestureItemClass.isOffline) {
            case true:
                break;
            case false:
                GameGestureEventClass.messageSendCenter(GameGestureEventClass.EVENT_GAMEREADY);
                break;
        }
    }
}