class gameResultInGame extends egret.DisplayObjectContainer {
    private winTitle: egret.Bitmap;

    private loseTitle: egret.Bitmap;
    constructor() {
        super();
        this.winTitle = AssetManager.getBitmap("win_png");
        this.loseTitle = AssetManager.getBitmap("lose_png");

        this.winTitle.x = -100 - this.winTitle.width;
        this.loseTitle.x = -100 - this.loseTitle.width;
        this.winTitle.y = App.GameHeight / 2;
        this.loseTitle.y = App.GameHeight / 2;
        this.addChild(this.winTitle);
        this.addChild(this.loseTitle);
    }
    win() {
        egret.Tween.get(this.winTitle).to({ x: App.GameWidth / 2 - 50 }, 400)
            .to({ x: App.GameWidth / 2 + 50 }, 1300).to({ x: App.GameWidth + 100 }, 400).call(() => {
                this.winTitle.x = -100 - this.winTitle.width;
            });
    }
    lose() {
        egret.Tween.get(this.loseTitle).to({ x: App.GameWidth / 2 - 50 }, 400)
            .to({ x: App.GameWidth / 2 + 50 }, 1300).to({ x: App.GameWidth + 100 }, 400).call(() => {
                this.loseTitle.x = -100 - this.loseTitle.width;
            });
    }
    recover() {
        this.winTitle.x = -100 - this.winTitle.width;
        this.loseTitle.x = -100 - this.loseTitle.width;
    }

    dispose() {
        egret.Tween.removeTweens(this.winTitle);
        egret.Tween.removeTweens(this.loseTitle);
    }
}