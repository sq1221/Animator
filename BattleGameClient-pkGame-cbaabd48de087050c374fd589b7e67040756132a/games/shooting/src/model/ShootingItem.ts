enum ShootingItemDirectionType {
    left,
    right
}

interface ShootingItemPort {
    effect(bullet: ShootingBullet);
}

class ShootingItem extends egret.DisplayObjectContainer implements ShootingItemPort {
    protected _itemType: ItemType;
    private _direction: ShootingItemDirectionType;
    private _rect: egret.Rectangle;
    private _itemPoint: egret.Point;
    private _isDestroy = false;

    public constructor() {
        super();
        this._rect = new egret.Rectangle();
        this._itemPoint = new egret.Point();
    }

    public get itemType() {
        return this._itemType;
    }

    public init(itemDirection: ShootingItemDirectionType) {
        this._isDestroy = false;
        this._direction = itemDirection;
        switch (this._direction) {
            case ShootingItemDirectionType.left:
                this.x = App.GameWidth + 100;
                break;
            case ShootingItemDirectionType.right:
                this.x = -100;
                break;
        }
        this.y = 450 * GameShootingView.instance.adaptScaleY;

        App.DisplayUtils.quickAddChild(GameShootingView.instance.bulletsLayer, this);
        GameShootingView.instance.shootingGame.items.push(this);

        this.localToGlobal(0, 0, this._itemPoint);
        this._rect.setTo(
            this._itemPoint.x - (this.width >> 1),
            this._itemPoint.y - (this.height >> 1),
            this.width,
            this.height
        );

        App.TimerManager.doFrame(1, 0, this.frame, this);
    }

    public getRect() {
        return this._rect;
    }

    public destroy() {
        this._isDestroy = true;

        App.TimerManager.remove(this.frame, this);
        App.DisplayUtils.quickRemoveChild(this);

        let index = GameShootingView.instance.shootingGame.items.indexOf(this);
        GameShootingView.instance.shootingGame.items.splice(index, 1);
    }

    private frame = (advancedTime: number) => {
        if (this._isDestroy) {
            return;
        }

        var speedX: number = UserConfig.ItemSpeed * advancedTime / UserConfig.frameTime;
        switch (this._direction) {
            case ShootingItemDirectionType.left:
                this.x -= speedX;
                this._itemPoint.x -= speedX;
                this._rect.x -= speedX;
                break;
            case ShootingItemDirectionType.right:
                this.x += speedX;
                this._itemPoint.x += speedX;
                this._rect.x += speedX;
                break;
        }

        if (this._itemPoint.x < -300 || this._itemPoint.x > App.GameWidth + 300) {
            this.destroy();
        }
    }

    effect(bullet: ShootingBullet) {

    }
}

class ShootingRocket extends ShootingItem {
    public constructor() {
        super();
        let rocket = AssetManager.getBitmap("rocketButton_png");
        rocket.x = (rocket.width >> 1);
        rocket.y = (rocket.height >> 1);
        App.DisplayUtils.quickAddChild(this, rocket);

        this.width = this.width;
        this.height = this.height;
    }

    init(itemDirection: ShootingItemDirectionType) {
        super.init(itemDirection);
        this._itemType = ItemType.rocket;
    }

    effect(bullet: ShootingBullet) {
        this.destroy();
        GameShootingView.instance.controlLayer.boomPlay(bullet.x, bullet.y);
        ShootingBullet.createShootingBullet_rocketByBullet(bullet, bullet.rotation);
        App.SoundManager.playEffect("shootinggetItem_mp3", true);
    }
}

class ShootingSplit extends ShootingItem {
    public constructor() {
        super();
        let split = AssetManager.getBitmap("splitButton_png");
        split.x = (split.width >> 1);
        split.y = (split.height >> 1);
        App.DisplayUtils.quickAddChild(this, split);

        this.width = this.width;
        this.height = this.height;
    }

    init(itemDirection: ShootingItemDirectionType) {
        super.init(itemDirection);
        this._itemType = ItemType.split;
    }

    effect(bullet: ShootingBullet) {
        this.destroy();
        GameShootingView.instance.controlLayer.boomPlay(bullet.x, bullet.y);
        App.SoundManager.playEffect("shootinggetItem_mp3", true);
        let split01: ShootingBullet, split02: ShootingBullet, split03: ShootingBullet;
        switch (bullet.type) {
            case BulletType.common:
                split01 = ShootingBullet.createShootingBulletByBullet(bullet, 0);
                split02 = ShootingBullet.createShootingBulletByBullet(bullet, 45);
                split03 = ShootingBullet.createShootingBulletByBullet(bullet, -45);
                break;
            case BulletType.rocket:
                split01 = ShootingBullet.createShootingBullet_rocketByBullet(bullet, 0);
                split02 = ShootingBullet.createShootingBullet_rocketByBullet(bullet, 45);
                split03 = ShootingBullet.createShootingBullet_rocketByBullet(bullet, -45);
                break;
            default:
                return;
        }
    }
}