enum DirectionType {
    up,
    down
}
enum BulletType {
    common,
    rocket
}
class ShootingBullet extends egret.DisplayObjectContainer {
    private _owner: string;
    public direction: DirectionType;
    public type: BulletType;
    private bullet_img: egret.Bitmap;
    private baozha: DBArmature;
    private globalPoint: egret.Point;
    private rect_bullet: egret.Rectangle;
    private moveSpeed_x: number;
    private moveSpeed_y: number;
    public halfWidth: number;
    public halfHeight: number;
    /**有可能存在延迟，标脏 */
    private isDestroy = false;

    public constructor(bitmapUrl: string) {
        super();

        this.rect_bullet = new egret.Rectangle();
        this.globalPoint = new egret.Point();

        //创建图片
        this.bullet_img = AssetManager.getBitmap(bitmapUrl);
        App.DisplayUtils.quickAddChild(this, this.bullet_img);

        //效率优化
        this.width = this.width;
        this.height = this.height;
        this.halfWidth = (this.width >> 1);
        this.halfHeight = (this.height >> 1);

        //创建爆炸效果
        this.baozha = AssetManager.getQuickDBArmature("game2_pao");
    }
    init = (owner: string, direction: DirectionType, bullettype?: BulletType) => {
        this.isDestroy = false;
        this._owner = owner;
        this.direction = direction;
        if (!bullettype) {
            this.type = BulletType.common;
        } else {
            this.type = bullettype;
        }

        App.TimerManager.doFrame(5 / GameShootingView.instance.adaptScaleY, 0, this.collisonFrame, this);
        App.TimerManager.doFrame(1, 0, this.transformFrame, this);
    }

    get owner() {
        return this._owner;
    }

    destroy = (isPlay = false) => {
        this.isDestroy = true;
        App.TimerManager.remove(this.collisonFrame, this);
        App.TimerManager.remove(this.transformFrame, this);

        if (this.delayNextRound) {
            clearTimeout(this.delayNextRound);
            this.delayNextRound = undefined;
        }

        if (isPlay) {
            if (this.direction == DirectionType.up) {
                this.baozha.rotation = 180;
                this.baozha.y = -50;
            } else {
                this.baozha.y = 50;
            }
            this.baozha.play("baozha", 1);
            this.baozha.addDisplayEvent(dragonBones.EventObject.COMPLETE, this.baozhaOver, this);
            App.DisplayUtils.quickAddChild(this, this.baozha);
        } else {
            this.removeFromParent();
        }
    }

    private baozhaOver = () => {
        this.removeFromParent();
    }

    private collisonShields(): boolean {
        //与盾牌碰撞
        let shootingGame = GameShootingView.instance.shootingGame;
        for (let key in shootingGame.shields) {
            var shield = shootingGame.shields[key];
            if (shield.owner != this.owner) {
                if (App.RectangleUtils.intersects(this.rect_bullet, shield.getRect())) {
                    if (this.type == BulletType.rocket) {//火箭炮打中
                        if (shootingGame.isOffLine) {
                            shield.destroy();
                        }
                        else {
                            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "shieldDestroy|" + shield.uid, 1);
                        }
                        return true;
                    } else {
                        shield.hit();
                        this.destroy(true);
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private collisonItems(): boolean {
        //与道具碰撞
        let shootingGame = GameShootingView.instance.shootingGame;
        for (let item of shootingGame.items) {
            if (App.RectangleUtils.intersects(this.rect_bullet, item.getRect())) {
                item.effect(this);
                return true;
            }
        }
        return false;
    }

    private collisonUser(): boolean {
        //与角色碰撞
        let shootingGame = GameShootingView.instance.shootingGame;
        let userImage = this.owner == "competitor" ? shootingGame.userController.userImage : shootingGame.competitorController.userImage;
        if (App.RectangleUtils.intersects(this.rect_bullet, userImage.getRect())) {
            if (!shootingGame.isWuDi) {
                shootingGame.isWuDi = true;
                this.destroy(true);

                //音效+动画+判断下一局开不开启
                let next = (isNext: boolean) => {
                    var effectName: string = this.owner == "competitor" ? "boom_self_mp3" : "boom_competitor_mp3";
                    App.SoundManager.playEffect(effectName, true);
                    userImage.stop();
                    if (isNext)
                        userImage.lose(this.stopRoundAndNext);
                    else
                        userImage.lose(this.stopRound);
                }
                if (this.owner == "competitor") {
                    shootingGame.scoreController.lose(next);
                } else {
                    shootingGame.scoreController.win(next);
                }
                return true;
            }
        }
        return false;
    }
    private collisonFrame = (advancedTime: number) => {
        if (this.isDestroy) {
            return;
        }
        this.rect_bullet.x = this.globalPoint.x - this.halfWidth;
        this.rect_bullet.y = this.globalPoint.y - this.halfHeight;
        this.collisonShields() || this.collisonItems() || this.collisonUser();
    }
    private transformFrame = (advancedTime: number) => {
        //子弹的运动控制
        if (this.isDestroy) {
            return;
        }
        //子弹的运动
        let offsetX = this.moveSpeed_x * advancedTime * GameShootingView.instance.adaptScaleY;
        let offsetY = this.moveSpeed_y * advancedTime * GameShootingView.instance.adaptScaleY;
        switch (this.direction) {
            case DirectionType.down:
                this.y += offsetY;
                this.x -= offsetX;
                this.globalPoint.x -= offsetX;
                this.globalPoint.y += offsetY;
                if (this.globalPoint.y > 760 / 1136 * App.GameHeight) {
                    this.destroy(true);
                    return;
                }
                break;
            case DirectionType.up:
                this.y -= offsetY;
                this.x += offsetX;
                this.globalPoint.x += offsetX;
                this.globalPoint.y -= offsetY;
                if (this.globalPoint.y < 150 / 1136 * App.GameHeight) {
                    this.destroy(true);
                    return;
                }
                break;
        }
    }

    private delayNextRound: number;
    private stopRoundAndNext = () => {
        let shootingGame = GameShootingView.instance.shootingGame;
        shootingGame.stopThisRound(() => {
            if (GameShootingView.instance.shootingGame.isOffLine)
                this.delayNextRound = setTimeout(() => {
                    shootingGame.nextRound();
                    clearTimeout(this.delayNextRound);
                    this.delayNextRound = undefined;
                }, 100);
            else {
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "nextRound|" + shootingGame.userID + "|" + shootingGame.scoreController.userScore + "|" + shootingGame.scoreController.competitorScore, 1);
            }
        });
    }
    private stopRound = () => {
        let shootingGame = GameShootingView.instance.shootingGame;
        shootingGame.stopThisRound();
    }

    private removeFromParent() {
        this.baozha.stop();
        this.baozha.removeDisplayEvent(dragonBones.EventObject.COMPLETE, this.baozhaOver, this);
        App.DisplayUtils.quickRemoveChild(this.baozha);

        App.DisplayUtils.quickRemoveChild(this);

        var index: number = GameShootingView.instance.shootingGame.bullets.indexOf(this);
        GameShootingView.instance.shootingGame.bullets.splice(index, 1);

        ObjectPool.push(this);
    }

    private setRotation($rotation): void {
        this.rotation = $rotation;
        this.moveSpeed_x = UserConfig.bulletSpeed * Math.sin($rotation / 180 * Math.PI) / UserConfig.frameTime;
        this.moveSpeed_y = UserConfig.bulletSpeed * Math.cos($rotation / 180 * Math.PI) / UserConfig.frameTime;
    }

    private static createShootingBulletInit(bullet: ShootingBullet, $x: number, $y: number, $rotation: number): void {
        bullet.x = $x;
        bullet.y = $y;
        bullet.setRotation($rotation);
        App.DisplayUtils.quickAddChild(GameShootingView.instance.bulletsLayer, bullet);
        GameShootingView.instance.shootingGame.bullets.push(bullet);

        bullet.localToGlobal(0, 0, bullet.globalPoint);
        bullet.rect_bullet.setTo(
            bullet.globalPoint.x - bullet.halfWidth,
            bullet.globalPoint.y - bullet.halfHeight,
            bullet.width,
            bullet.height
        );
    }

    public static popShootingBullet(): ShootingBullet {
        return ObjectPool.pop(ShootingBullet, "ShootingBullet", "bullet1_png");
    }

    public static popShootingBullet_rocket(): ShootingBullet {
        return ObjectPool.pop(ShootingBullet, "ShootingBullet_rocket", "rocket_png");
    }

    public static createShootingBullet($x: number, $y: number, $rotation: number): ShootingBullet {
        var newBullet: ShootingBullet = this.popShootingBullet();
        this.createShootingBulletInit(newBullet, $x, $y, $rotation);
        return newBullet;
    }

    public static createShootingBullet_rocket($x: number, $y: number, $rotation: number): ShootingBullet {
        var newBullet: ShootingBullet = this.popShootingBullet_rocket();
        this.createShootingBulletInit(newBullet, $x, $y, $rotation);
        return newBullet;
    }

    public static createShootingBulletByBullet(bullet: ShootingBullet, rotation: number): ShootingBullet {
        var newBullet: ShootingBullet = this.createShootingBullet(bullet.x, bullet.y, rotation);
        newBullet.init(bullet.owner, bullet.direction);
        return newBullet;
    }

    public static createShootingBullet_rocketByBullet(bullet: ShootingBullet, rotation: number): ShootingBullet {
        var newBullet: ShootingBullet = this.createShootingBullet_rocket(bullet.x, bullet.y, rotation);
        newBullet.init(bullet.owner, bullet.direction, BulletType.rocket);
        return newBullet;
    }
}