class ShootingComController {
    userImage: ShootingCharacter;
    private tempImage: ShootingCharacter;
    private targetX: number;
    private walk: walkType;
    constructor() {
        this.walk = walkType.stand;
        this.userImage = new ShootingCharacter(DataCenter.instance.room.player);
        this.userImage.x = App.GameWidth - this.userImage.halfWidth;
        this.userImage.y = 100 * GameShootingView.instance.adaptScaleY;
        this.userImage.rotation = 180;

        this.tempImage = new ShootingCharacter(DataCenter.instance.room.player, true);
        this.tempImage.x = this.userImage.x - App.GameWidth;
        this.tempImage.y = this.userImage.y;
        this.tempImage.rotation = 180;
        this.tempImage.name = "temp";

        GameShootingView.instance.basicLayer.addChild(this.userImage);
        GameShootingView.instance.basicLayer.addChild(this.tempImage);

        this.initRectAndPoint();

        App.TimerManager.doFrame(1, 0, this.frame, this);
        //游戏内事件返回
        if (!GameShootingView.instance.shootingGame.isOffLine)
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
        this.userImage.x = App.GameWidth - this.userImage.halfWidth;
        this.userImage.y = 100 * GameShootingView.instance.adaptScaleY;
        this.tempImage.x = this.userImage.x - App.GameWidth;
        this.tempImage.y = this.userImage.y;
        this.targetX = undefined;
        this.initRectAndPoint();
        this.userImage.nextRound();
    }
    /**接受网络传来的事件 */
    private onGameEvent(data: any): void {
        if (data.userId == DataCenter.instance.user.id) {
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
            case "right":
                console.log("对手向左走了")
                this.walk = walkType.left;
                this.tempImage.walkLeft();
                this.userImage.walkLeft();
                break;
            case "left":
                console.log("对手向右走了")
                this.walk = walkType.right;
                this.tempImage.walkRight();
                this.userImage.walkRight();
                break;
            case "stand":
                console.log("对手不动了")
                this.walk = walkType.stand;
                let name = datas[1];
                if (name != this.userImage.name) {
                    let s = this.tempImage;
                    this.tempImage = this.userImage;
                    this.userImage = s;
                }
                this.targetX = App.GameWidth - parseInt(datas[2]);
                this.tempImage.stop();
                this.userImage.stop();
                this.tempImage.stand();
                this.userImage.stand();
                break;
            case "fire":
                console.log("对手开枪了")
                this.setCompetitorFire();
                break;
            case "shield":
                console.log("对手放盾牌了")
                this.setCompetitorShield();
                break;
        }
    }
    private setCompetitorShield = () => {
        let key = ShootingGetUID.getUID();
        App.SoundManager.playEffect("shootingSetWall_mp3", true);
        let shield = new ShootingShield("competitor", key);
        shield.x = this.userImage.x + 10;
        shield.y = this.userImage.y + 150 * GameShootingView.instance.adaptScaleY;
        shield.rotation = 180;
        shield.setRect(shield.x, shield.y);
        GameShootingView.instance.competitorshields.addChild(shield);
        GameShootingView.instance.shootingGame.shields[key] = shield;
    }
    private frame(advancedTime: number) {
        if (GameShootingView.instance.shootingGame.isWuDi) return;
        let offset = UserConfig.walkSpeed * advancedTime / UserConfig.frameTime;
        switch (this.walk) {
            case walkType.left:
                this.setUserImageX(-offset);
                break;
            case walkType.right:
                this.setUserImageX(offset);
                break;
            case walkType.stand:
                if (!this.targetX) return;
                if (this.targetX - this.userImage.x < UserConfig.walkSpeed && this.targetX - this.userImage.x > -UserConfig.walkSpeed) {
                    this.userImage.x = this.targetX;
                    if (this.targetX + App.GameWidth > App.GameWidth && this.targetX + App.GameWidth < 3 * (App.GameWidth >> 1))
                        this.tempImage.x = this.targetX + App.GameWidth;
                    else
                        this.tempImage.x = this.targetX - App.GameWidth;
                    this.targetX = undefined;
                    return;
                }
                offset = UserConfig.walkSpeed * advancedTime / UserConfig.frameTime;
                if (this.targetX - this.userImage.x > 0)
                    this.setUserImageX(offset, false);
                if (this.targetX - this.userImage.x < 0)
                    this.setUserImageX(-offset, false);
                break;
        }
    }

    private setCompetitorFire() {
        let bullet: ShootingBullet = ShootingBullet.createShootingBullet(this.userImage.paoPosition.x,
            this.userImage.paoPosition.y + 100 * GameShootingView.instance.adaptScaleY, 0);
        bullet.init("competitor", DirectionType.down);

        this.userImage.fire();
        App.SoundManager.playEffect("fire_mp3", true);
    }

    private userImagePoint: egret.Point;
    private tempImagePoint: egret.Point;
    private setUserImageX(offset: number, isChange = true) {
        this.userImage.x += offset;
        this.tempImage.x += offset;
        this.userImagePoint.x += offset;
        this.tempImagePoint.x += offset;

        if (isChange) {
            if (this.userImage.x < 0 && this.userImage.x > -this.userImage.halfWidth) {//左侧部分出界
                let s = this.tempImage;
                this.tempImage = this.userImage;
                this.userImage = s;
                this.swapPoints();
            }
            if (this.userImage.x > App.GameWidth && this.userImage.x - App.GameWidth < this.userImage.halfWidth) {//右侧部分出界
                let s = this.tempImage;
                this.tempImage = this.userImage;
                this.userImage = s;
                this.swapPoints();
            }
        }
        if (this.tempImage.x < -(App.GameWidth >> 1)) {//左侧全部出界
            this.tempImage.x = this.userImage.x + App.GameWidth;
            this.tempImage.localToGlobal(0, 0, this.tempImagePoint);
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
        App.TimerManager.remove(this.frame, this);
        App.MessageCenter.removeListener(EventMessage.ReceiveGameEventS2C, this.onGameEvent, this);
    }
}

class GameShootingAI {
    private competitorController: ShootingComController
    constructor(cc: ShootingComController) {
        this.competitorController = cc;
        GameShootingAI.shieldLimit = UserConfig.shieldLimit;
        GameShootingAI.bulleteLimit = UserConfig.bulletLimit;
    }

    stop = () => {
        App.TimerManager.remove(this.aiControl, this);
    }
    play = () => {
        App.TimerManager.doTimer(UserConfig.AITime, 0, this.aiControl, this);
    }
    static shieldLimit: number;
    static bulleteLimit: number;
    private static isReload = false;
    private aiControl() {
        if (GameShootingView.instance.shootingGame.isWuDi) {
            return;
        }
        if (GameShootingAI.bulleteLimit <= 0 && !GameShootingAI.isReload) {
            App.TimerManager.doTimer(UserConfig.reloadBullet, 1, () => {
                GameShootingAI.bulleteLimit = UserConfig.bulletLimit;
                GameShootingAI.isReload = false;
            }, this)
            GameShootingAI.isReload = true;
        }
        let random = Math.random();
        if (random < 0.6) {
            if (GameShootingAI.bulleteLimit > 0) {
                this.competitorController["setCompetitorFire"]();
                GameShootingAI.bulleteLimit--;
            }
        }
        if (random < 0.5 && GameShootingAI.shieldLimit > 0) {
            this.competitorController["setCompetitorShield"]();
            GameShootingAI.shieldLimit--;
        }
        if (random < 0.3) {
            this.competitorController["walk"] = walkType.right;
            return;
        }
        if (random < 0.6) {
            this.competitorController["walk"] = walkType.left;
            return;
        }
        if (random < 0.9) {
            this.competitorController["walk"] = walkType.stand;
            return;
        }
    }

    static addAIItem() {
        let random = Math.random();
        let item: ShootingItem;
        let direct: ShootingItemDirectionType;
        if (random < 0.2) {
            item = ObjectPool.pop(ShootingRocket, "ShootingRocket");
            direct = ShootingItemDirectionType.left;
        } else if (random < 0.4) {
            item = ObjectPool.pop(ShootingRocket, "ShootingRocket");
            direct = ShootingItemDirectionType.right;
        } else if (random < 0.6) {
            item = ObjectPool.pop(ShootingSplit, "ShootingSplit");
            direct = ShootingItemDirectionType.right;
        } else if (random < 0.8) {
            item = ObjectPool.pop(ShootingSplit, "ShootingSplit");
            direct = ShootingItemDirectionType.left;
        } else {
            return;
        }
        item.init(direct);
    }

    dipose() {
        this.stop();
    }
}