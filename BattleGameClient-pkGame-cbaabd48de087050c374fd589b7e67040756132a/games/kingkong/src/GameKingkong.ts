class GameKingkong extends StateBG {

    private _sceneLeft: KingkongScene;
    private _sceneRight: KingkongScene;

    private _uiContainer: egret.DisplayObjectContainer;
    private _progress1: DBProgress;
    private _progress2: DBProgress;
    private _win: number;
    private returnToLastButton: egret.Bitmap;
    private _conBitmap: egret.Bitmap;
    public constructor() {
        super();


        this._uiContainer = new egret.DisplayObjectContainer();

        this._progress1 = new DBProgress(AssetManager.getDBArmature("progress1"));
        this._progress2 = new DBProgress(AssetManager.getDBArmature("progress2"));
    }

    public init(): void {
        super.init();
        this.bg = "bg_jpg";

        if (this.background.height > App.GameHeight) {
            this.background.height = App.GameHeight;
            this.background.anchorOffsetY = this.background.height / 2;
            this.background.y = App.GameHeight / 2;
        }
        let topBg = AssetManager.getBitmap("blackMask_png", false, false);
        topBg.width = topBg.height = App.GameWidth;
        topBg.anchorOffsetY = topBg.height;
        topBg.y = (App.GameHeight - this.background.height) / 2;

        let backBg = AssetManager.getBitmap("blackMask_png", false, false);
        backBg.width = backBg.height = App.GameWidth;
        backBg.y = App.GameHeight - (App.GameHeight - this.background.height) / 2;

        this._sceneLeft = new KingkongScene(this.background.width, this.background.height, true);
        this._sceneRight = new KingkongScene(this.background.width, this.background.height);

        App.SoundManager.playBg("kingkongBgMusic_mp3");
        if (!DataCenter.instance.room.IsAI) {
            this._sceneRight.mode = KingkongScene.MODE_NET;
        }
        else {
            this._sceneRight.mode = KingkongScene.MODE_AI;
        }
        this._sceneRight.self = false;
        this._sceneRight.scaleX = -1;
        this._sceneRight.scaleY = -1;
        this._sceneRight.x = this.background.width;
        this._sceneRight.y = this.background.height + (App.GameHeight - this.background.height) / 2;

        this._uiContainer.width = this.background.width;
        this._uiContainer.height = this.background.height;
        this._uiContainer.anchorOffsetY = this._uiContainer.height / 2;
        this._uiContainer.anchorOffsetX = this._uiContainer.width / 2;
        this._uiContainer.x = App.GameWidth / 2;
        this._uiContainer.y = App.GameHeight / 2;

        this._conBitmap = AssetManager.getBitmap("spaceBg_png", false, false);
        this._conBitmap.width = App.GameWidth;
        this._conBitmap.height = App.GameHeight;
        this.addChild(this._conBitmap);

        this._sceneLeft.y = (App.GameHeight - this.background.height) / 2;

        this.addChild(this._sceneRight);
        this.addChild(this._sceneLeft);
        this.addChild(this._uiContainer);

        this._progress1.x = this.background.width;
        this._progress1.y = this.background.height / 2;
        this._progress1.rotation = 90;
        this._progress2.x = this.background.width;
        this._progress2.y = this.background.height / 2;
        this._progress2.rotation = 90;


        this._uiContainer.addChild(this._progress2);
        this._uiContainer.addChild(this._progress1);

        let maskTop = AssetManager.getBitmap("mask_png")
        maskTop.anchorOffsetX = maskTop.width / 2;
        maskTop.anchorOffsetY = maskTop.height;
        maskTop.x = this._progress1.x - 5;
        maskTop.y = this._progress1.y - 280;
        this._uiContainer.addChild(maskTop);

        let maskBottom = AssetManager.getBitmap("mask_png")
        maskBottom.anchorOffsetX = maskBottom.width / 2;
        maskBottom.anchorOffsetY = 0;
        maskBottom.x = this._progress1.x - 5;
        maskBottom.y = this._progress1.y + 280;
        this._uiContainer.addChild(maskBottom);

        let winLine = AssetManager.getBitmap("winLine_jpg");
        winLine.anchorOffsetX = winLine.width / 2;
        winLine.anchorOffsetY = 0;
        winLine.x = this._progress1.x + 1;
        winLine.y = this._progress1.y - 270;
        this._uiContainer.addChild(winLine);

        // 小米平台去掉退出按钮
        if (!App.IsXiaoMi && !App.IsWanba ) {
            this.returnToLastButton = AssetManager.getBitmap("goBack_png", false, false);
            this.returnToLastButton.y = 19;
            this._uiContainer.addChild(this.returnToLastButton);
            this.returnToLastButton.touchEnabled = true;
            this.returnToLastButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                this.popup("GameSureLeave");
            }, this)
        }


        this.addChild(topBg);
        this.addChild(backBg);

        this._conBitmap.touchEnabled = true;
        this._conBitmap.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);

        this._sceneLeft.addEventListener(Kingkong.EVENT_SHOOT, this.onLeftShoot, this);
        this._sceneRight.addEventListener(Kingkong.EVENT_SHOOT, this.onRightShoot, this);

        this._sceneLeft.addEventListener(Kingkong.EVENT_WIN, this.onLeftWin, this);
        this._sceneRight.addEventListener(Kingkong.EVENT_WIN, this.onRightWin, this);

        this._sceneLeft.addEventListener(Kingkong.EVENT_GAME_START, this.onGameStart, this);
        this._sceneLeft.addEventListener(Kingkong.EVENT_GAME_OVER, this.onGameOver, this);
        this._sceneRight.addEventListener(Kingkong.EVENT_GAME_OVER, this.onGameOver, this);

        this._sceneLeft.addEventListener(KingkongScene.EVENT_BOOM, this.onMasterEvent, this);
        this._sceneLeft.addEventListener(KingkongScene.EVENT_GET_BANANA, this.onMasterEvent, this);
        this._sceneLeft.addEventListener(KingkongScene.EVENT_GET_BOOM, this.onMasterEvent, this);
        this._sceneLeft.addEventListener(KingkongScene.EVENT_JUMP, this.onMasterEvent, this);
        this._sceneLeft.addEventListener(KingkongScene.EVENT_SHOOT, this.onMasterEvent, this);
        this._sceneLeft.addEventListener(KingkongScene.EVENT_SHOOT_GROUND, this.onMasterEvent, this);

        //游戏内事件返回
        App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        //结果返回
        App.MessageCenter.addListener(EventMessage.ReceiveGameResultS2C, this.onGameResult, this);
    }
    private onMasterEvent(e: egret.Event): void {
        if (this._sceneRight.mode != KingkongScene.MODE_NET) {
            return;
        }
        let curDis: number = e.data;
        switch (e.type) {
            case KingkongScene.EVENT_BOOM:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "boom");
                break;
            case KingkongScene.EVENT_GET_BANANA:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "getBanana");
                break;
            case KingkongScene.EVENT_GET_BOOM:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "getBoom");
                break;
            case KingkongScene.EVENT_JUMP:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "jump");
                break;
            case KingkongScene.EVENT_SHOOT:
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "shoot");
                break;
            case KingkongScene.EVENT_SHOOT_GROUND:
                break;
        }
    }

    private onGameEvent(data: any): void {
        if (data.userId == DataCenter.instance.user.id) {
            return;
        }

        switch (data.event) {
            case "getBoom":
                this._sceneRight.kingkongGetBoom();
                break;
            case "getBanana":
                this._sceneRight.kingkongGetBanana();
                break;
            case "boom":
                this._sceneRight.kingkongHit();
                break;
            case "jump":
                this._sceneRight.kingkongJump();
                break;
            case "shoot":
                this._sceneRight.kingkongShoot();
                break;
        }
    }

    private isStop: boolean;
    private stop(): void {
        if (this.isStop) {
            return;
        }

        this.isStop = true;
        this._progress1.progress = 0;
        this._progress2.progress = 0;
        this._sceneLeft.dispose();
        this._sceneRight.dispose();
    }

    private onGameOver(e): void {
        this.stop();

        App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, this._win);
    }

    private onGameResult(data: any): void {
        // 游戏结算数据
        DataCenter.instance.room.gameResult = data;
        // 打开结算面板
        this.popup("GameResult", null);
    }

    private onGameStart(e): void {
        this._win = 1;
        this._sceneRight.startRun();
    }

    private onLeftWin(e): void {
        this._win = 3;
        this._sceneRight.fail();
    }
    private onRightWin(e): void {
        this._win = 1;
        this._sceneLeft.fail();
    }

    private onLeftShoot(e): void {
        this._sceneLeft.fireBoom(this._sceneRight.addBoom);
    }
    private onRightShoot(e): void {
        this._sceneRight.fireBoom(this._sceneLeft.addBoom);
    }
    private onTouchBegin(e: egret.TouchEvent): void {
        if (e.stageX < this.background.width / 2) {
            if (e.stageY > this.background.height / 2) {
                //if(this._sceneLeft.mode == KingkongScene.MODE_MANUAL)
                {
                    this._sceneLeft.touchLeft();
                }
            }
            else {
                if (this._sceneRight.mode == KingkongScene.MODE_MANUAL) {
                    this._sceneRight.touchRight();
                }

            }

        }
        else {

            if (e.stageY > this.background.height / 2) {
                //if(this._sceneLeft.mode == KingkongScene.MODE_MANUAL)
                {
                    this._sceneLeft.touchRight();
                }
            }
            else {
                if (this._sceneRight.mode == KingkongScene.MODE_MANUAL) {
                    this._sceneRight.touchLeft();
                }


            }
        }
    }

    public tick(advancedTime: number): void {
        if (this._sceneLeft.gameStart) {
            if (this._progress2) {
                this._progress2.progress = this._sceneLeft.progress;
            }
            if (this._progress1) {
                this._progress1.progress = this._sceneRight.progress;
            }
        }

    }
    public dispose(): void {
        super.dispose();
        this._conBitmap.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);

        this._sceneLeft.removeEventListener(Kingkong.EVENT_SHOOT, this.onLeftShoot, this);
        this._sceneRight.removeEventListener(Kingkong.EVENT_SHOOT, this.onRightShoot, this);

        this._sceneLeft.removeEventListener(Kingkong.EVENT_WIN, this.onLeftWin, this);
        this._sceneRight.removeEventListener(Kingkong.EVENT_WIN, this.onRightWin, this);

        this._sceneLeft.removeEventListener(Kingkong.EVENT_GAME_START, this.onGameStart, this);
        this._sceneRight.removeEventListener(Kingkong.EVENT_GAME_START, this.onGameStart, this);

        this._sceneLeft.dispose();
        this._sceneRight.dispose();

        ObjectPool.clearClass("KingkongItem");
    }
}