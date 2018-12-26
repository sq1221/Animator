class Kingkong extends egret.Sprite {
    public static EVENT_RECOVER: string = "EVENT_RECOVER";
    public static EVENT_SHOOT: string = "EVENT_SHOOT";
    public static EVENT_JUMP: string = "EVENT_JUMP";
    public static EVENT_WIN: string = "EVENT_WIN";
    public static EVENT_GAME_START: string = "EVENT_GAME_START";
    public static EVENT_GAME_OVER: string = "EVENT_GAME_OVER";

    public static STATUS_RUN: number = 0;
    public static STATUS_JUMP: number = 1;
    public static STATUS_HIT: number = 2;
    public static STATUS_STAND: number = 3;
    public static STATUS_OVER: number = 4;

    public static ARM_LENGTH: number = 84;
    public static LEG_LENGTH: number = 60;
    public static LENGTH: number = Kingkong.ARM_LENGTH + Kingkong.LEG_LENGTH;

    public static NORMAL_SPEED: number = 2;
    public static FAST_SPEED: number = 3;
    public static SLOW_SPEED: number = 1;

    public dbKingkong: DBArmature;

    public boomArmature: dragonBones.Armature;
    public hasBoom: boolean;
    private _status: number;
    private _jumpState: dragonBones.AnimationState;

    public invincible: boolean;
    private _fast: boolean;
    private _slow: boolean;
    private _boomBone: dragonBones.Bone;

    private _dust: DBArmature;
    private _bananaPeel: DBArmature;
    private _speedTw: egret.Tween;

    public constructor(master: boolean = false) {
        super();
        var name: string = "kingkong";
        var avatarName: string = master ? "kingkong" : "kingkongBlue";


        this.dbKingkong = AssetManager.getDBArmature(avatarName);
        this.dbKingkong.scaleX = this.dbKingkong.scaleY = 1.2;
        this._dust = AssetManager.getDBArmature("dust");
        if (this._dust) {
            this._dust.timeScale = 1.5;
        }

        this._bananaPeel = AssetManager.getDBArmature("bananaPeel");
        //if(this._bananaPeel)
        {
            this._bananaPeel.timeScale = 1.5;
            this._bananaPeel.gotoAndStop("run");
        }

        //armatureDisplay.scaleX = armatureDisplay.scaleY = 0.5;
        // this.armature.animation.play("hit");
        this.addChild(this.dbKingkong);
        //armatureDisplay.scaleX = armatureDisplay.scaleY = 0.5;
        //armatureDisplay.rotation = -90;

        // this.boom = new KingBomb();

        // this._boomBone = this.kingArmature.getBone("boom");
        // this.addChild(this.boo)
        let boomSlot = this.dbKingkong.getSlot("boom");
        if (boomSlot) {
            this.boomArmature = boomSlot.childArmature;
        }

        this.dbKingkong.replaceSlot("dust", this._dust);
        this.dbKingkong.replaceSlot("bananaPeel", this._bananaPeel);
    }

    public onAir(): boolean {
        if (this._status == Kingkong.STATUS_JUMP) {
            if (this._jumpState && this._jumpState.currentTime > 0.17 && this._jumpState.currentTime < 1.5) {
                return true;
            }
        }
        return false;
    }
    public run(): void {
        this.invincible = false;
        this._status = Kingkong.STATUS_RUN;
        this.dbKingkong.timeScale = Kingkong.NORMAL_SPEED;
        if (this._fast) {
            this._speedTw = egret.Tween.get(this.dbKingkong);
            this._speedTw.to({ "timeScale": Kingkong.FAST_SPEED }, 500);
            //this.kingArmature.animation.timeScale = Kingkong.FAST_SPEED;
        }
        else if (this._slow) {
            this.dbKingkong.timeScale = Kingkong.SLOW_SPEED;
        }
        else {
            // this._speedTw = egret.Tween.get(this.kingArmature.animation);
            // this._speedTw.to({"timeScale":Kingkong.NORMAL_SPEED},500);
            this.dbKingkong.timeScale = Kingkong.NORMAL_SPEED;
        }

        this.dbKingkong.play("run", 0);
    }
    public playHit(): void {
        if (this._speedTw) {
            egret.Tween.removeTweens(this.dbKingkong);
        }
        this.invincible = true;
        this._fast = false;
        this._status = Kingkong.STATUS_HIT;
        this.dbKingkong.timeScale = Kingkong.NORMAL_SPEED;
        this.dbKingkong.play("boom", 1);
        this.dbKingkong.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onBoomComplete, this);
    }
    private onBoomComplete(e: dragonBones.Event): void {
        this.dispatchEvent(new egret.Event(Kingkong.EVENT_RECOVER))
        this.run();
        this.dbKingkong.removeDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onBoomComplete, this);
    }
    public jumpEnable(): boolean {
        return this._status == Kingkong.STATUS_RUN;
    }
    public jump(): void {
        if (this._speedTw) {
            egret.Tween.removeTweens(this.dbKingkong);
        }
        this.invincible = false;
        this._status = Kingkong.STATUS_JUMP;
        this.dbKingkong.timeScale = Kingkong.NORMAL_SPEED;
        this._jumpState = this.dbKingkong.play("jump", 1);
        this.dbKingkong.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onJumpComplete, this);
        let boomType: number = Math.floor(Math.random() * 7) + 1;
        this._dust.play("boom" + boomType, 1);
    }
    public runFast(): void {
        this._fast = true;
        this._slow = false;
        if (this._bananaPeel) {
            this._bananaPeel.play("run", 1);
        }
        if (this._status == Kingkong.STATUS_RUN) {
            this._speedTw = egret.Tween.get(this.dbKingkong);
            this._speedTw.to({ "timeScale": Kingkong.FAST_SPEED }, 500);
            // this.kingArmature.animation.timeScale = Kingkong.FAST_SPEED;
        }
    }
    public runSlow(): void {
        this._slow = true;
        this._fast = false;
        if (this._status == Kingkong.STATUS_RUN) {
            this.dbKingkong.timeScale = Kingkong.SLOW_SPEED;
        }
    }
    public runNormal(): void {
        this._fast = false;
        if (this._status == Kingkong.STATUS_RUN) {
            this._speedTw = egret.Tween.get(this.dbKingkong);
            this._speedTw.to({ "timeScale": Kingkong.NORMAL_SPEED }, 500);
            this.dbKingkong.timeScale = Kingkong.NORMAL_SPEED;
        }
    }
    private onJumpComplete(e: dragonBones.Event): void {
        if (this._fast) {
            this.dbKingkong.timeScale = Kingkong.FAST_SPEED;
        }
        else if (this._slow) {
            this.dbKingkong.timeScale = Kingkong.SLOW_SPEED;
        }
        else {
            this.dbKingkong.timeScale = Kingkong.NORMAL_SPEED;
        }
        this.run();
        this.dbKingkong.removeDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onJumpComplete, this);
    }
    public stand(): void {
        this.invincible = true;
        this._status = Kingkong.STATUS_STAND;
        this.dbKingkong.gotoAndStop("stand");
    }
    public getBoom(v: boolean): void {
        this.hasBoom = v;
        if (this.boomArmature) {
            let anim: string = this.hasBoom ? "boom1" : "boom0"
            this.boomArmature.animation.gotoAndStop(anim);
        }
    }
    public reset(): void {
        this._fast = false;
        this._slow = false;
        this.invincible = false;
    }
}