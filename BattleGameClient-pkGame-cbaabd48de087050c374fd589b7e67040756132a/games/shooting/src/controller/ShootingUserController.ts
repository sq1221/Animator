enum walkType {
    left,
    right,
    stand
}
class UserConfig {
    static frameTime = 60;

    static shieldLimit = 3;//盾牌最大数量
    static shieldHP = 6;//盾牌血量

    static bulletLimit = 9;//子弹最大数量
    static bulletSpeed = 50;//子弹飞行速度
    static reloadBullet = 2000;//换弹时间毫秒

    static ItemSpeed = 10;//道具飞行速度
    static walkSpeed = 8;//一帧走的像素数量
    static scores = 3;//角色血量+比分设置

    static splitRotation = 15;

    static AITime = 250;
    static ItemTime = 1500;
}
enum ItemType {
    common,
    rocket,
    split,
    shield
}
class ShootingUserController {
    private _walk: walkType;
    public userImage: ShootingCharacter;
    private tempImage: ShootingCharacter;
    private bulletView: ShootingBulletController;
    private userImagePoint: egret.Point;
    private tempImagePoint: egret.Point;

    constructor() {
        this.bulletView = new ShootingBulletController();

        this.userImage = new ShootingCharacter(DataCenter.instance.user);
        this.userImage.x = this.userImage.halfWidth;
        this.userImage.y = 800 * GameShootingView.instance.adaptScaleY;

        this.tempImage = new ShootingCharacter(DataCenter.instance.user, true);
        this.tempImage.x = this.userImage.x + App.GameWidth;
        this.tempImage.y = this.userImage.y;
        this.tempImage.name = "temp";

        GameShootingView.instance.basicLayer.addChild(this.userImage);
        GameShootingView.instance.basicLayer.addChild(this.tempImage);

        this.walk = walkType.stand;

        this.initRectAndPoint();

        App.TimerManager.doFrame(1, 0, this.frame, this);
        App.MessageCenter.addListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
    }
    private initRectAndPoint() {
        this.userImagePoint = new egret.Point();
        this.tempImagePoint = new egret.Point();
        this.userImage.localToGlobal(0, 0, this.userImagePoint);
        this.tempImage.localToGlobal(0, 0, this.tempImagePoint);
        this.setRect();
    }

    private setRect() {
        this.userImage.setRect(this.userImagePoint.x - this.userImage.halfWidth, this.userImagePoint.y - this.userImage.halfHeight, this.userImage.width, this.userImage.height);
        this.tempImage.setRect(this.tempImagePoint.x - this.tempImage.halfWidth, this.tempImagePoint.y - this.tempImage.halfHeight, this.tempImage.width, this.tempImage.height);
    }

    nextRound() {
        this.userImage.x = this.userImage.halfWidth;
        this.userImage.y = 800 * GameShootingView.instance.adaptScaleY;
        this.tempImage.x = this.userImage.x + App.GameWidth;
        this.tempImage.y = this.userImage.y;
        this.initRectAndPoint();
        this.walk = walkType.stand;
        this.bulletView.nextRound();
        this.userImage.nextRound();
    }
    setShield() {
        let shootingGame = GameShootingView.instance.shootingGame
        if (shootingGame.isWuDi) return;
        if (GameShootingView.instance.controlLayer.shield > 0) {
            if (shootingGame.isOffLine)
                this.setSelfShield();
            else
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "shield", 1);
        }
    }
    private onGameEvent(data: any): void {
        if (data.userId != DataCenter.instance.user.id) {
            return;
        }
        /** 
         * "stand|123"
         * command：stand && parameter：123 
         * */
        let parseData = (data: string): string[] => {
            let splitChar = data.split("|");
            return splitChar;
        }
        let datas = parseData(data.event);
        switch (datas[0]) {
            case "fire":
                this.setSelfFire();
                break;
            case "shield":
                this.setSelfShield();
                break;
        }
    }

    /**服务器发回来开始开枪 */
    private setSelfFire() {
        let bullet: ShootingBullet = ShootingBullet.createShootingBullet(this.userImage.paoPosition.x,
            this.userImage.paoPosition.y - 100 * GameShootingView.instance.adaptScaleY, 0);
        bullet.init("self", DirectionType.up);
        this.userImage.fire();
        this.bulletView.fire();
        App.SoundManager.playEffect("fire_mp3", true);
        if (this.bulletView.bulletLimit <= 0) {
            this.bulletView.reload();
        }
    }

    /**服务器发回来开始放盾牌 */
    private setSelfShield() {
        let key = ShootingGetUID.getUID();
        let shield = new ShootingShield("self", key);
        App.SoundManager.playEffect("shootingSetWall_mp3", true);
        shield.x = this.userImage.x + 10;
        shield.y = this.userImage.y - 150 * GameShootingView.instance.adaptScaleY;
        shield.setRect(shield.x, shield.y);
        GameShootingView.instance.selfShields.addChild(shield);
        GameShootingView.instance.shootingGame.shields[key] = shield;
        GameShootingView.instance.controlLayer.shield--;
    }

    public set walk(type: walkType) {
        if (this._walk == type) {
            return;
        }
        this._walk = type;
        if (this._walk == walkType.stand) {//在站立时做位置修正
            if (!GameShootingView.instance.shootingGame.isOffLine)
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, walkType[this._walk].toString() + "|" + this.userImage.name + "|" + this.userImage.x);
            this.tempImage.stand();
            this.userImage.stand();
        } else {
            if (!GameShootingView.instance.shootingGame.isOffLine)
                App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, walkType[this._walk].toString());
            if (this._walk == walkType.left) {
                this.tempImage.walkLeft();
                this.userImage.walkLeft();
            } else {
                this.tempImage.walkRight();
                this.userImage.walkRight();
            }
        }
    }

    public startFire(): void {
        if (GameShootingView.instance.shootingGame.isWuDi)
            return;
        this.continueFire();
        App.TimerManager.doTimer(250, 0, this.continueFire, this);
    }

    public stopFire(): void {
        App.TimerManager.remove(this.continueFire, this);
    }

    private continueFire(): void {
        if (this.bulletView.bulletLimit <= 0) {
            this.bulletView.cannotFire();
            this.stopFire();
            return;
        }

        if (!GameShootingView.instance.shootingGame.isOffLine) {
            App.MessageCenter.dispatch(EventMessage.SendGameEventC2S, "fire", 1);
        }
        else {
            this.setSelfFire();
        }
    }
    private frame(advancedTime: number) {
        if (GameShootingView.instance.shootingGame.isWuDi)
            return;

        var sppedX: number = UserConfig.walkSpeed * advancedTime / UserConfig.frameTime;
        switch (this._walk) {
            case walkType.left:
                this.setUserImageX(-sppedX);
                break;
            case walkType.right:
                this.setUserImageX(sppedX);
                break;
            case walkType.stand:
                break;
        }
    }

    private setUserImageX(offset: number) {
        this.userImage.x += offset;
        this.tempImage.x += offset;
        this.userImagePoint.x += offset;
        this.tempImagePoint.x += offset;

        if (this.userImage.x < 0 && this.userImage.x > -this.userImage.halfWidth) {//左侧部分出界
            let s = this.tempImage;
            this.tempImage = this.userImage;
            this.userImage = s;

            this.swapPoints();
        }
        if (this.tempImage.x < -(App.GameWidth >> 1)) {//左侧全部出界
            this.tempImage.x = this.userImage.x + App.GameWidth;
            this.tempImage.localToGlobal(0, 0, this.tempImagePoint);
        }

        if (this.userImage.x > App.GameWidth && this.userImage.x - App.GameWidth < this.userImage.halfWidth) {//右侧部分出界
            let s = this.tempImage;
            this.tempImage = this.userImage;
            this.userImage = s;

            this.swapPoints();
        }
        if (this.tempImage.x > 3 * (App.GameWidth >> 1)) {//右侧全部出界
            this.tempImage.x = this.userImage.x - App.GameWidth;
            this.tempImage.localToGlobal(0, 0, this.tempImagePoint);
        }
        this.setRect();
    }


    private swapPoints() {
        let x = this.userImagePoint.x;
        this.userImagePoint.x = this.tempImagePoint.x;
        this.tempImagePoint.x = x;
        let y = this.userImagePoint.y;
        this.userImagePoint.y = this.tempImagePoint.y;
        this.tempImagePoint.y = y;
    }

    public dispose(): void {
        this.stopFire();
        App.TimerManager.remove(this.frame, this);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
        this.bulletView.dispose();
    }
}