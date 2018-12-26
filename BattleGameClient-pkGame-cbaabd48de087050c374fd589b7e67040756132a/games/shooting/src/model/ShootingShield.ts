class ShootingShield extends egret.DisplayObjectContainer {
    hp: number;
    private _owner: string;
    private shield_img: egret.Bitmap;
    private _uid: number;
    private _rect: egret.Rectangle;
    get uid() {
        return this._uid;
    }

    constructor(owner: string, key: number) {
        super();
        this._uid = key;
        this._owner = owner;
        this.hp = UserConfig.shieldHP;
        this.shield_img = AssetManager.getBitmap("shield1_png");
        this.addChild(this.shield_img);
        this._rect = new egret.Rectangle();
        this._rect.width = this.shield_img.width;
        this._rect.height = this.shield_img.height;
    }

    setRect(x: number, y: number) {
        let point = GameShootingView.instance.localToGlobal(x, y, GameShooting.point);
        this._rect.x = point.x - (this.shield_img.width >> 1);
        this._rect.y = point.y - (this.shield_img.height >> 1);
    }

    getRect() {
        return this._rect;
    }

    get owner() {
        return this._owner;
    }

    hit() {
        if (this.parent) {
            this.hp--;
            egret.Tween.get(this).to({ scaleY: 0.8 }, 100).to({ scaleY: 1 }, 100)
                .to({ scaleY: 0.9 }, 100).to({ scaleY: 1 }, 100)
            if (this.hp < 5) {
                this.shield_img.texture = RES.getRes("shield2_png");
            }
            if (this.hp < 3) {
                this.shield_img.texture = RES.getRes("shield3_png");
            }
            if (this.hp <= 0) {
                if (GameShootingView.instance.shootingGame.isOffLine)
                    this.destroy();
                else
                    App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "shieldDestroy|" + this.uid, 1);
            }
        }
    }
    
    destroy() {
        this.parent.removeChild(this);
        let shootingGame = GameShootingView.instance.shootingGame;
        delete shootingGame.shields[this.uid];
        if (this._owner == "self") {
            GameShootingView.instance.controlLayer.shield++;
        }
        if (this._owner == "competitor" && shootingGame.isOffLine) {
            GameShootingAI.shieldLimit++;
        }
    }
}