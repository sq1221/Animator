class GameShootingView extends State {
    basicLayer: egret.DisplayObjectContainer;//基础图层，没有玩的时候存在的游戏物体层级
    selfShields: egret.DisplayObjectContainer;//自己的盾牌图层
    bulletsLayer: egret.DisplayObjectContainer;//子弹存在的图层
    competitorshields: egret.DisplayObjectContainer;//敌人盾牌图层
    controlLayer: ControlLayer;//控制按钮所在图层
    roundBG: egret.Shape;
    static instance: GameShootingView;
    timeImg: GameReady;
    shootingGame: GameShooting;
    private result: gameResultInGame;
    background: egret.Bitmap;
    adaptScaleY: number;
    constructor() {
        super();
        GameShootingView.instance = this;
        this.background = AssetManager.getBitmap("background_png", false, false);
        this.adaptScaleY = App.GameHeight / this.background.height;
        this.background.height = App.GameHeight;

        //图层顺序添加
        this.basicLayer = new egret.DisplayObjectContainer();
        this.selfShields = new egret.DisplayObjectContainer();
        this.bulletsLayer = new egret.DisplayObjectContainer();
        this.competitorshields = new egret.DisplayObjectContainer();
        this.controlLayer = new ControlLayer();

        this.addChild(this.basicLayer);
        this.addChild(this.competitorshields);
        this.addChild(this.bulletsLayer);
        this.addChild(this.selfShields);
        this.addChild(this.controlLayer);
        //回合结束黑屏
        this.roundBG = new egret.Shape();
        this.roundBG.alpha = 0;
        this.roundBG.graphics.beginFill(0x000000);
        this.roundBG.graphics.drawRect(0, 0, App.GameWidth, App.GameHeight);
        this.roundBG.graphics.endFill();
        this.addChild(this.roundBG);

        this.basicLayer.addChild(this.background);

        this.shootingGame = new GameShooting();
        this.shootingGame.init();

        this.timeImg = new GameReady(GameShootingView.instance.shootingGame.startTime);
        this.timeImg.x = 300;
        this.timeImg.y = App.GameHeight / 2;
        this.basicLayer.addChild(this.timeImg);
        this.timeImg.play();

        this.result = new gameResultInGame();
        this.controlLayer.addChild(this.result);
    }

    resultWin() {
        this.result.win();
    }

    resultlose() {
        this.result.lose();
    }

    dispose() {
        super.dispose();
        this.timeImg.dispose();
        this.controlLayer.dispose();
        this.result.dispose();
        this.shootingGame.dispose();
    }

}

class ControlLayer extends egret.DisplayObjectContainer {
    constructor() {
        super();
        this.addUIButton();
    }
    private leftButton: DBAnimButton;
    private rightButton: DBAnimButton;
    private fireButton: DBAnimButton;
    private shieldButton: DBAnimButton;
    private returnToLastButton: egret.Bitmap;
    private boom: DBArmature;
    private shieldNumberImg: egret.Bitmap;
    private _shield: number;
    set shield(value: number) {
        if (value >= 0 && value <= 3) {
            this._shield = value;
            this.shieldNumberImg.texture = AssetManager.getBitmap("D" + value + "_png").texture;
            if (value == 0)
                this.shieldButton["_armature"].replaceSlot("shield", AssetManager.getBitmap("shieldGray_png"));
            else
                this.shieldButton["_armature"].replaceSlot("shield", AssetManager.getBitmap("shield_png"));
        }

    }
    get shield() {
        return this._shield;
    }
    private directArea: egret.DisplayObjectContainer;
    private addUIButton() {
        this.directArea = new egret.DisplayObjectContainer();
        
        // 小米平台去掉退出按钮
        if (!App.IsXiaoMi && !App.IsWanba ) {
            this.returnToLastButton = AssetManager.getBitmap("goBack_png", false, false);
            this.returnToLastButton.y = 19;
            this.addChild(this.returnToLastButton);
            this.returnToLastButton.touchEnabled = true;
            this.returnToLastButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                GameShootingView.instance.popup("GameSureLeave");
            }, this)
        }

        this.leftButton = new DBAnimButton(AssetManager.getQuickDBArmature("rightButton"))
        this.leftButton.scaleX = -1;

        this.directArea.addChild(this.leftButton);
        this.leftButton.x = 10;
        this.leftButton.y = 10;
        this.leftButton.touchEnabled = true;
        this.leftButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.leftButtonPress, this);

        this.rightButton = new DBAnimButton(AssetManager.getQuickDBArmature("rightButton"));
        this.directArea.addChild(this.rightButton);
        this.rightButton.x = 160;
        this.rightButton.y = 10;
        this.rightButton.touchEnabled = true;
        this.rightButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.rightButtonPress, this);
        this.directArea.x = 80;
        this.directArea.y = GameShootingView.instance.background.height - 100;
        this.addChild(this.directArea);

        this.touchEnabled = this.touchChildren = true;
        this.directArea.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.controlPress, this);

        this.directArea.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.directAreaRelease, this);

        let point: egret.Point;
        point = this.leftButton.localToGlobal(this.leftButton.width / 2 - 10, -this.leftButton.height / 2 + 10, point);
        this.leftRect = new egret.Rectangle(point.x, point.y, this.leftButton.width, this.leftButton.height);

        point = this.rightButton.localToGlobal(-this.rightButton.width / 2 - 10, -this.rightButton.height / 2 + 10, point);
        this.rightRect = new egret.Rectangle(point.x, point.y, this.rightButton.width, this.rightButton.height);

        this.directArea.height += 20;
        this.directArea.width += 20;
        point = this.directArea.localToGlobal(10, - this.directArea.height / 2 + 10, point);
        this.directAreaRect = new egret.Rectangle(point.x, point.y, this.directArea.width - 20, this.directArea.height - 20);

        this.shieldButton = new DBAnimButton(AssetManager.getQuickDBArmature("shieldButton"));
        this.shieldButton.x = 400;
        this.shieldButton.y = GameShootingView.instance.background.height - 100;
        this.addChild(this.shieldButton);
        this.shieldButton.touchEnabled = true;
        this.shieldButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shieldButtonTap, this);

        this.shieldNumberImg = AssetManager.getBitmap("D3_png");
        this.shieldNumberImg.x = this.shieldButton.x + this.shieldButton.width / 4;
        this.shieldNumberImg.y = this.shieldButton.y - this.shieldButton.height / 4;
        this.addChild(this.shieldNumberImg);

        this.fireButton = new DBAnimButton(AssetManager.getQuickDBArmature("fireButton"));
        this.fireButton.x = 550;
        this.fireButton.y = GameShootingView.instance.background.height - 100;
        this.addChild(this.fireButton);
        this.fireButton.touchEnabled = true;
        this.fireButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.fireButtonPress, this);
        this.fireButton.addEventListener(egret.TouchEvent.TOUCH_END, this.fireButtonRelease, this);
        this.fireButton.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.fireButtonRelease, this);

        this.shield = UserConfig.shieldLimit;
        this.boom = AssetManager.getQuickDBArmature("boom");
        this.boom.addDisplayEvent(dragonBones.EventObject.COMPLETE, this.boomOver, this);

        // document.addEventListener("keydown", this.onKeyDown);
        // document.addEventListener("keyup", this.onKeyUp);
    }

    private onKeyDown = (evt): void => {
        console.log(evt.keyCode)
        if (evt.keyCode == 65 || evt.keyCode == 37) {
            this.leftButtonPress();
        }
        if (evt.keyCode == 68 || evt.keyCode == 39) {
            this.rightButtonPress();
        }

        if (evt.keyCode == 87 || evt.keyCode == 38) {
            this.fireButtonPress();
        }
        if (evt.keyCode == 83 || evt.keyCode == 40) {
            this.shieldButtonTap();
        }
    }
    private onKeyUp = (evt): void => {
        if (evt.keyCode == 65 || evt.keyCode == 37) {
            this.directAreaRelease();
        }
        if (evt.keyCode == 68 || evt.keyCode == 39) {
            this.directAreaRelease();
        }
        if (evt.keyCode == 87 || evt.keyCode == 38) {
            this.fireButtonRelease();
        }
    }
    private leftButtonPress = () => {
        GameShootingView.instance.shootingGame.userController.walk = walkType.left;
        this.directArea.addEventListener(egret.TouchEvent.TOUCH_END, this.controlRelease, this);
        this.directArea.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.controlTouchMove, this);
    }
    private rightButtonPress = () => {
        GameShootingView.instance.shootingGame.userController.walk = walkType.right;
        this.directArea.addEventListener(egret.TouchEvent.TOUCH_END, this.controlRelease, this);
        this.directArea.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.controlTouchMove, this);
    }
    private directAreaRelease() {
        GameShootingView.instance.shootingGame.userController.walk = walkType.stand;
    }

    private controlPress = () => {
        this.directArea.addEventListener(egret.TouchEvent.TOUCH_END, this.controlRelease, this);
        this.directArea.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.controlTouchMove, this);
    }
    private leftRect: egret.Rectangle;
    private rightRect: egret.Rectangle;
    private directAreaRect: egret.Rectangle;
    private touchPoint: egret.Point = new egret.Point();
    private controlTouchMove = (event: egret.TouchEvent) => {
        this.touchPoint.x = event.stageX;
        this.touchPoint.y = event.stageY;
        if (this.leftRect.containsPoint(this.touchPoint)) {
            GameShootingView.instance.shootingGame.userController.walk = walkType.left;
            return;
        }
        if (this.rightRect.containsPoint(this.touchPoint)) {
            GameShootingView.instance.shootingGame.userController.walk = walkType.right;
            return;
        }
        if (!this.directAreaRect.containsPoint(this.touchPoint)) {
            this.controlRelease();
            return;
        }
        GameShootingView.instance.shootingGame.userController.walk = walkType.stand;
    }
    private controlRelease = () => {
        this.directArea.removeEventListener(egret.TouchEvent.TOUCH_END, this.controlRelease, this);
        this.directArea.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.controlTouchMove, this);
        GameShootingView.instance.shootingGame.userController.walk = walkType.stand;
    }
    private fireButtonPress() {
        GameShootingView.instance.shootingGame.userController.startFire();
    }
    private fireButtonRelease() {
        GameShootingView.instance.shootingGame.userController.stopFire();
    }


    private shieldButtonTap() {
        GameShootingView.instance.shootingGame.userController.setShield();
    }
    dispose() {
        this.leftButton.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.leftButtonPress, this);
        this.rightButton.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.rightButtonPress, this);
        this.directArea.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.controlPress, this);
        this.fireButton.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.fireButtonPress, this);
        this.fireButton.removeEventListener(egret.TouchEvent.TOUCH_END, this.fireButtonRelease, this);
        this.fireButton.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.fireButtonRelease, this);
        this.directArea.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.directAreaRelease, this);
        this.shieldButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.shieldButtonTap, this);
        document.removeEventListener("keydown", this.onKeyDown);
        document.removeEventListener("keyup", this.onKeyUp);
        this.boom.dispose();
    }

    boomPlay(x: number, y: number) {
        this.boom.x = x;
        this.boom.y = y;
        this.boom.play("boom", 1);
        App.DisplayUtils.quickAddChild(this, this.boom);
    }

    private boomOver(): void {
        App.DisplayUtils.quickRemoveChild(this.boom);
    }
}