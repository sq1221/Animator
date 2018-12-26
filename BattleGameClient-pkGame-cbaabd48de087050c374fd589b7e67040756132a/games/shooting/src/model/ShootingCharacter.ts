class ShootingCharacter extends egret.DisplayObjectContainer {
    userImage: DBArmature;
    personImg: DBArmature;
    istemp = false;
    private _rect: egret.Rectangle;
    private _paoPosition: egret.Point;
    public halfWidth:number;
    public halfHeight:number;
    constructor(persondata: User, istemp = false, defaultAvatar: string = "game2_pao") {
        super();
        this.userImage = AssetManager.getQuickDBArmature(defaultAvatar);
        this.userImage.x = 30;
        this.istemp = istemp;
        this.personImg = new RoleAvatar(persondata.curAvatarType, persondata.imgUrl).armature;
        this.personImg.scaleX = 0.8;
        this.personImg.scaleY = 0.8;
        this.personImg.play("home");

        this.addChild(this.personImg);
        this.addChild(this.userImage);

        this.width = this.width;
        this.height = this.height;
        this.halfWidth = this.width >> 1;
        this.halfHeight = this.height >> 1;

        this._rect = new egret.Rectangle();
        this._paoPosition = new egret.Point();
    }
    setRect(x: number, y: number, width: number, height: number) {
        this._rect.x = x;
        this._rect.y = y;
        this._rect.width = width;
        this._rect.height = height;
    }

    getRect() {
        return this._rect;
    }
    get paoPosition() {
        this.localToGlobal(this.userImage.x, this.userImage.y, this._paoPosition);
        return this._paoPosition;
    }

    walkLeft() {
        this.userImage.play("zuo");
    }
    walkRight() {
        this.userImage.play("you");
    }
    stand() {
        this.userImage.stop();
        this.userImage.play("wz", 1);
    }
    lose(callback?: Function) {
        this.userImage.play("over", 1);
        this.personImg.play("Loser1", 1);
        if (callback) {
            let call = () => {
                this.userImage.removeDisplayEvent(dragonBones.EventObject.COMPLETE, call, this);
                callback();
            }
            this.userImage.addDisplayEvent(dragonBones.EventObject.COMPLETE, call, this);
        }
    }
    nextRound() {
        this.userImage.play("wz", 1);
        this.personImg.play("home");
    }
    fire() {
        this.userImage.play("paoshe", 1);
    }
    stop() {
        this.userImage.stop();
        this.personImg.stop();
    }
}