class KingkongScene extends egret.DisplayObjectContainer {
    public static EVENT_SHOOT: string = "kingkongScene:EVENT_SHOOT";
    public static EVENT_SHOOT_GROUND: string = "kingkongScene:EVENT_SHOOT_GROUND";
    public static EVENT_JUMP: string = "kingkongScene:EVENT_JUMP";
    public static EVENT_BOOM: string = "kingkongScene:EVENT_BOOM";
    public static EVENT_GET_BOOM: string = "kingkongScene:EVENT_GET_BOOM";
    public static EVENT_GET_BANANA: string = "kingkongScene:EVENT_GET_BANANA";


    public static MODE_MANUAL: number = 0;
    public static MODE_NET: number = 1;
    public static MODE_AI: number = 2;

    public static FAST_TIME: number = 3000;
    public static INVINCIBLE_TIME: number = 1.1;//无敌时间；动画时间1秒

    public static touched: boolean;

    public stageWidth: number;
    public stageHeight: number;

    private _building: Building;


    private _kingkong: Kingkong;

    private _curDistance: number;
    private _totalDistance: number = 35570;

    private _loopLockPoint: boolean;

    private _itemContainer: egret.DisplayObjectContainer;
    private _uiContainer: egret.DisplayObjectContainer;
    private _curItemConfigs: any[] = [];
    private _curItems: KingkongItem[] = [];
    private _kingkongPosMinY: number = 1521;
    private _kingkongPosMaxY: number = 1900;
    private _fastLastTime: number = 3; // 3second;
    private _fast: boolean;
    private _slow: boolean;

    public self: boolean = true;
    private btnJump: DBArmature;
    private btnShoot: DBArmature;
    private _tip: DBArmature;
    private _kingkongPosY: number;
    private _kingkongOffsetY: number = 240;
    private _avatar: DBArmature;
    private _chain: egret.Bitmap;
    private _gameStart: boolean;
    public master: boolean;
    public key: KingkongItem;
    private _curLevel: number = 1;

    private _curTime: number;
    private _mode: number;
    private _ai: AIKingkong;
    private _lastAddedBoom: KingkongItem;
    private _invincibleTime: number = 0;
    public progress: number = 0;
    public constructor(width: number, height: number, master: boolean = false, uiLayer: egret.DisplayObjectContainer = null) {
        super();
        this.master = master;
        this.stageWidth = width;
        this.stageHeight = height;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAdded, this);
        this._building = new Building();
        this._kingkong = new Kingkong(master);
        if (!this.master) this._kingkongOffsetY -= 100;
        this._itemContainer = new egret.DisplayObjectContainer();
        if (uiLayer) {
            this._uiContainer = uiLayer;
        }
        else {
            this._uiContainer = new egret.DisplayObjectContainer();
        }
        this.btnJump = AssetManager.getDBArmature("tiaoyue");
        this.btnShoot = AssetManager.getDBArmature("renglei");
        this._tip = AssetManager.getDBArmature("tishi");
        let personData: User;
        if (this.master) personData = DataCenter.instance.user;
        else personData = DataCenter.instance.room.player;
        this._avatar = new RoleAvatar(personData.curAvatarType, personData.imgUrl, "dbxiaoren00_game1").armature;
        this._chain = AssetManager.getBitmap("chain_png");
    }

    public set mode(v: number) {
        this._mode = v;
        if (this._mode == KingkongScene.MODE_AI) {
            this.initAI(AIKingkong.AI_LEVEL_3);
        }
    }
    public get mode(): number {
        return this._mode;
    }
    public get gameStart(): boolean {
        return this._gameStart;
    }
    private tipFlag: number;
    private addTip(): void {
        if (this._tip) {
            this._tip.play("tishi2", 0);
            this.tipFlag = setTimeout(() => {
                this.removeTip();
            }, 2000);
            this._tip.x = this.btnJump.x;
            this._tip.y = this.btnJump.y;
            this._uiContainer.addChild(this._tip);
        }
    }
    private removeTip(): void {
        if (this._tip && this._tip.parent) {
            this._tip.stop();
            this._tip.parent.removeChild(this._tip);
            clearTimeout(this.tipFlag);
            this.tipFlag = undefined;
        }
    }
    private onAdded(e: egret.Event): void {
        this.init();
    }
    public dispose(): void {
        App.TimerManager.remove(this.advanceTime, this);
        this.removeAllItems();
        this._itemContainer.removeChildren();
        if (this.tipFlag) {
            clearTimeout(this.tipFlag);
        }
    }
    public init(): void {
        //data//
        let levelConfig: any[] = RES.getRes("levelConfig_json").level[this._curLevel];
        this._curItemConfigs = levelConfig.concat();
        //////////ground/////////////////
        this._building.x = this.stageWidth;
        this._building.y = this.stageHeight;

        this.addChild(this._building);
        this._building.stop();

        //////////////avatar////////////////
        this._avatar.x = this.stageWidth / 2;
        this._avatar.y = this.stageHeight / 2 + 200;
        this._avatar.scaleX = this._avatar.scaleY = 0.7;
        this.addChild(this._avatar);
        this._chain.x = this._avatar.x;
        this._chain.y = this._avatar.y;
        this._chain.scaleX = this._chain.scaleY = 0.7;
        this.addChild(this._chain);
        ////////////////ui/////////////////////////
        this._uiContainer.x = 0;
        this._uiContainer.y = 0;
        this.addChild(this._uiContainer);
        this.btnJump.x = this.btnShoot.x = this.stageWidth * 0.5;
        this.btnJump.y = this.btnShoot.y = this.stageHeight - 40;
        this._uiContainer.addChild(this.btnJump);
        this._uiContainer.addChild(this.btnShoot);

        ///////////////items//////////////
        this.addChild(this._itemContainer);

        this._itemContainer.x = this.stageWidth - 60;
        this._itemContainer.y = 0;

        if (!this.master) {
            this.btnJump.visible = false;
            this.btnShoot.visible = false;
        }

        /////////////kingkong
        this._kingkong.x = this.stageWidth - 60;
        this._kingkong.y = this.stageHeight - this._kingkongOffsetY;
        this._kingkongPosY = this._kingkong.y;
        ////碰撞区域
        this._kingkongPosMaxY = this._kingkongPosY + Kingkong.LEG_LENGTH + KingkongItem.HALF_SIZE;
        this._kingkongPosMinY = this._kingkongPosY - Kingkong.LEG_LENGTH - KingkongItem.HALF_SIZE;//
        this.addChild(this._kingkong);
        this._kingkong.stand();

        this._totalDistance = this.configToD(this._curItemConfigs[this._curItemConfigs.length - 1].d) + this.stageHeight - this._kingkongOffsetY;
        // this.addChild(this._win);
        // this.startRun();

        if (this._mode == KingkongScene.MODE_AI) {
            this.initAI(AIKingkong.AI_LEVEL_3);
        }

        if (this.master) {
            this.preStart();
        }

        ///////////////////////////
        // var test:KingkongItem = new KingkongItem();
        // test.type = 4;
        // this._itemContainer.addChild(test);
        App.TimerManager.doTimer(1, 0, this.advanceTime, this)
    }

    public initAI(level: number): void {
        if (this._mode == KingkongScene.MODE_AI) {
            if (this._ai == null) {
                this._ai = new AIKingkong();
                this._ai.addEventListener(Kingkong.EVENT_SHOOT, this.onAIShoot, this);
                this._ai.addEventListener(Kingkong.EVENT_JUMP, this.onAIJump, this);
            }
            this._ai.level = level;
            this._ai.kingkong = this._kingkong;
            this._ai.curItems = this._curItems;
        }
    }
    private onAIShoot(e): void {
        this.touchLeft();
    }
    private onAIJump(e): void {
        this.touchRight();
    }

    public advanceTime(advancedTime: number): boolean {
        if (this._gameStart) {
            this._building.advanceTime(advancedTime);

            this._curTime += advancedTime;
            this._curDistance = this._building.curDistance;
            this.addItems();
            this.moveItems();
            this.removeItems();
            this.testHit();
            if (this._fast) {
                this.checkFast(advancedTime);
            }
            this.checkWin();

            // if (this.master && !KingkongScene.touched && this._curTime > KingkongScene.TIP_TIME && this._tip.parent == null) {
            //     this.addTip();
            // }
            this.progress = this._curDistance / this._totalDistance;
            if (this._mode == KingkongScene.MODE_AI) {
                this._ai.advanceTime(advancedTime)
            }
            if (this._invincibleTime > 0) {
                this._invincibleTime -= advancedTime;
            }
        }
        return true;
    }

    private checkWin(): void {
        if (this._curDistance > this._totalDistance) {
            this.win();

        }
    }
    public fail(): void {
        // this._avatar.play("lost", 1);
        this._kingkong.getBoom(false);
        this.btnShoot.play("renglei0", 1);
        this.removeTip();
        this.gameOver();
    }
    private win(): void {
        if (this.key) {
            this.key.x += this._itemContainer.x;
            this.key.y += this._itemContainer.y;
            this._uiContainer.addChild(this.key);
            let tw = egret.Tween.get(this.key);
            var targetOffX: number = (this._avatar.x) - this.key.x;
            var targetOffY: number = (this._avatar.y) - this.key.y;
            tw.to({ "x": this.key.x + targetOffX / 2, "y": this.key.y + targetOffY / 2, "scaleX": 2, "scaleY": 2 }, 500);
            tw.to({ "x": this.key.x + targetOffX, "y": this.key.y + targetOffY, "scaleX": 1, "scaleY": 1 }, 500);
            tw.call(() => {
                this._avatar.play("win");
                this._chain.alpha = 0;
                this.key.x = 0;
                this.removeItem(this.key, 0);
                this.key = null;
            })
            tw.wait(1000);
            tw.call(() => {
                this.dispatchEvent(new egret.Event(Kingkong.EVENT_GAME_OVER));
            })
        }

        this._kingkong.getBoom(false);
        this.btnShoot.play("renglei0", 1);
        this.removeTip();
        //this.addChild(this._win);
        this.dispatchEvent(new egret.Event(Kingkong.EVENT_WIN));

        this.gameOver();
    }
    private gameOver(): void {
        this._curDistance = 0;
        this._fastLastTime = 0;
        this._building.curDistance = 0;
        this._curTime = 0;
        this._gameStart = false;
        this._building.stop();
        this._kingkong.stand();
        this.removeTip();
        if (this._mode == KingkongScene.MODE_AI) {
            this._ai.over();
        }
        if (this.tipFlag) {
            clearTimeout(this.tipFlag);
        }
    }
    private checkFast(advancedTime: number): void {
        if (this._fastLastTime > 0) {
            this._fastLastTime -= advancedTime;
        }
        else {
            this.stopFast();
        }
    }
    private testHit(): void {
        let i: number;
        let len: number;
        let hit: boolean;
        let hitType: number;
        let hitItem: KingkongItem;
        for (i = 0, len = this._curItems.length; i < len; i++) {
            if (this._curItems[i].type === KingkongItem.TYPE_WIN)//终点线
                return;
            if (this._curItems[i].type != KingkongItem.TYPE_KEY && this._curItems[i].y > this._kingkongPosMinY) {
                if (this._curItems[i].y < this._kingkongPosMaxY) {
                    if (!this._kingkong.onAir() && !this._kingkong.invincible) {
                        hitItem = this._curItems[i];
                        hit = true;
                        hitType = this._curItems[i].type;

                        this.removeItem(hitItem, i);
                        break;
                    }
                }
            }
            else {
                break;
            }
        }
        if (hit) {
            if (this.mode != KingkongScene.MODE_NET) {
                switch (hitType) {
                    case KingkongItem.TYPE_BANANA:
                        this.kingkongGetBanana();
                        break;
                    case KingkongItem.TYPE_BOOM:
                        this.kingkongGetBoom();
                        break;
                    case KingkongItem.TYPE_FIRE_BOOM:
                        if (this._invincibleTime <= 0) {
                            this.kingkongHit();
                            this._invincibleTime = KingkongScene.INVINCIBLE_TIME;
                        }
                        break;
                }
            }
        }
    }

    private stopFast(): void {
        this._fast = false;
        this._building.runNormal();
        this._kingkong.runNormal();
    }

    public kingkongGetBanana(): void {
        if (this.master) {
            this.dispatchEvent(new egret.Event(KingkongScene.EVENT_GET_BANANA, false, false, this._curDistance));
        }

        this._fast = true;
        this._slow = false;
        App.SoundManager.playEffect("banana_mp3", true);
        this._fastLastTime = KingkongScene.FAST_TIME;
        this._building.runFast();
        this._kingkong.runFast();
        this._avatar.play("chi", 1);
    }
    public kingkongGetBoom(): void {
        if (this.master) {
            this.dispatchEvent(new egret.Event(KingkongScene.EVENT_GET_BOOM, false, false, this._curDistance));
        }

        this._kingkong.getBoom(true);
        this.btnShoot.play("renglei1", 1);
        // App.SoundManager.playEffect("getBomb_mp3", true);
        if (this.master && !this.tipFlag)
            this.addTip();
    }
    private kingkongRecover(): void {
        this._slow = false;
        this._fast = false;
        this._building.runNormal();
        this._kingkong.runNormal();
        this._kingkong.removeEventListener(Kingkong.EVENT_RECOVER, this.onKingkongRecover, this);
    }
    private onKingkongRecover(e): void {
        this.kingkongRecover();
    }
    public kingkongHit(): void {
        if (this.master) {
            this.dispatchEvent(new egret.Event(KingkongScene.EVENT_BOOM, false, false, this._curDistance));
        }

        this._slow = true;
        this._fast = false;
        this._building.runSlow();
        this._kingkong.runSlow();
        this._kingkong.getBoom(false);
        this.removeTip();
        App.SoundManager.playEffect("kingkongBoom_mp3", true);
        this.btnShoot.play("renglei0", 1);
        this._kingkong.addEventListener(Kingkong.EVENT_RECOVER, this.onKingkongRecover, this);
        this._kingkong.playHit();
        this._avatar.play("zha", 1);
    }
    private disToConfig(d: number): number {
        return (this._curDistance - d) / 100;
    }
    private configToD(d: number): number {
        return d * 100;
    }
    public fireBoom = (arrive: Function) => {
        let boom: KingkongItem = ObjectPool.pop(KingkongItem, "KingkongItem");
        boom.type = KingkongItem.TYPE_FIRE_BOOM;
        boom.x = 0;
        if (!this.master) {
            boom.y = this.stageHeight - this._kingkongOffsetY - 100;
            App.SoundManager.playEffect("renglei_mp3", true);
        }
        else {
            boom.y = this.stageHeight - this._kingkongOffsetY;
            App.SoundManager.playEffect("renglei2_mp3", true);
        }
        this._itemContainer.addChild(boom);
        let tw = egret.Tween.get(boom);
        tw.to({ "x": -this.stageWidth / 3, "scaleX": 2, "scaleY": 2, rotation: 90 }, 250);
        tw.to({ "x": -this.stageWidth / 4 * 3, "scaleX": 1, "scaleY": 1, rotation: 180 }, 250);
        tw.call(() => {
            if (boom.parent)
                boom.parent.removeChild(boom);
            arrive();
        });
    }
    public addBoom = () => {
        let boom: KingkongItem = ObjectPool.pop(KingkongItem, "KingkongItem");
        boom.type = KingkongItem.TYPE_FIRE_BOOM;
        boom.x = 0;
        if (!this.master) {
            boom.y = this._kingkongOffsetY + 100;
        }
        else {
            boom.y = this._kingkongOffsetY;
        }
        this._itemContainer.addChild(boom);
        this.addBoomComplete(boom);
    }
    private addBoomComplete(boom: KingkongItem): void {
        boom.pos = this.disToConfig(boom.y);

        if (!this.master) {
            this.dispatchEvent(new egret.Event(KingkongScene.EVENT_SHOOT_GROUND, false, false, boom.pos));
        }
        this._lastAddedBoom = boom;
        let i: number;
        let len: number;
        let added: boolean;
        for (i = 0, len = this._curItems.length; i < len; i++) {
            if (this._curItems[i].pos > boom.pos) {
                this._curItems.splice(i, 0, boom);
                added = true;
                break;
            }
        }
        if (!added) {
            this._curItems.push(boom);
        }

    }
    private addItems(): void {
        if (this._curItemConfigs.length > 0) {
            let t: number = this._curItemConfigs[0].d;
            let type: number = this._curItemConfigs[0].t;
            let d: number = this.configToD(t);
            while (d < this._curDistance) {
                this._curItemConfigs.shift();
                var p: KingkongItem = ObjectPool.pop(KingkongItem, "KingkongItem");
                p.x = 0;
                p.type = type;
                p.pos = t;
                if (p.type == KingkongItem.TYPE_KEY) {
                    this.key = p;
                }
                this._itemContainer.addChild(p);
                this._curItems.push(p);
                if (this._curItemConfigs.length > 0) {
                    t = this._curItemConfigs[0].d;
                    type = this._curItemConfigs[0].t;
                    d = this.configToD(t);
                }
                else {
                    d = Number.MAX_VALUE;
                    break;
                }
            }
        }
    }
    private moveItems(): void {
        let i: number;
        let len: number;
        let p: KingkongItem;
        for (i = 0, len = this._curItems.length; i < len; i++) {
            p = this._curItems[i];
            p.y = this._curDistance - this.configToD(p.pos);
            // console.log(p.y, this._kingkong.y);
        }
    }
    private removeItem(item: KingkongItem, index: number): void {
        ObjectPool.push(item);
        this._curItems.splice(index, 1);
        if (item.parent) {
            item.parent.removeChild(item);
        }
    }
    private removeItems(): void {
        let i: number;
        let len: number;
        let p: KingkongItem;

        for (i = 0, len = this._curItems.length; i < len; i++) {
            p = this._curItems[i];
            if (p.y > this.stageHeight && p.type != KingkongItem.TYPE_KEY) {
                //console.log("remove ", p.hit, p.y);
                ObjectPool.push(p);
                this._curItems.splice(i, 1);
                i--;
                len--;
                if (p.parent) {
                    p.parent.removeChild(p);
                }
            }
        }
    }

    private removeAllItems(): void {
        let i: number;
        let len: number;
        let p: KingkongItem;

        for (i = 0, len = this._curItems.length; i < len; i++) {
            p = this._curItems[i];
            ObjectPool.push(p);
            this._curItems.splice(i, 1);
            i--;
            len--;
            if (p.parent) {
                p.parent.removeChild(p);
            }
        }
    }
    public touchLeft(): void {
        if (this._kingkong.hasBoom) {
            this.kingkongShoot();
        }
    }
    public touchRight(): void {
        if (this._kingkong.jumpEnable()) {
            this.kingkongJump();
        }
    }

    public kingkongJump(): void {
        if (this.master) {
            this.dispatchEvent(new egret.Event(KingkongScene.EVENT_JUMP, false, false, this._curDistance));
        }
        this._kingkong.jump();
        App.SoundManager.playEffect("kingkongjump_mp3", true);
        this.btnJump.play("tiaoyue", 1);
        KingkongScene.touched = true;
    }
    public kingkongShoot(): void {
        if (this.master) {
            this.dispatchEvent(new egret.Event(KingkongScene.EVENT_SHOOT, false, false, this._curDistance));
        }
        let btnShootOver = () => {
            this.btnShoot.removeDisplayEvent(dragonBones.EventObject.COMPLETE, btnShootOver, this);
            this.btnShoot.play("renglei0", 1);
        }
        this.btnShoot.addDisplayEvent(dragonBones.EventObject.COMPLETE, btnShootOver, this);
        this.btnShoot.play("renglei2", 1);
        this._kingkong.getBoom(false);
        this.removeTip();
        this.dispatchEvent(new egret.Event(Kingkong.EVENT_SHOOT));
        KingkongScene.touched = true;
    }

    public preStart(): void {
        let timeImg = new GameReady(() => {
            this.startRun();
            this.dispatchEvent(new egret.Event(Kingkong.EVENT_GAME_START))
        });
        timeImg.x = 300;
        timeImg.y = App.GameHeight / 2;
        this.addChild(timeImg);
        timeImg.play();
    }
    public startRun(): void {
        this._gameStart = true;
        this._curTime = 0;
        this.progress = 0;
        this._building.reset();
        this._kingkong.reset();
        this._invincibleTime = 0;
        this._curDistance = 0;
        if (this._avatar) {
            this._avatar.play("newAnimation");
        }
        this._building.run();
        this._kingkong.run();
        if (this._mode == KingkongScene.MODE_AI) {
            this._ai.start();
        }
    }
}