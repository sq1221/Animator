class DBArmature extends egret.DisplayObjectContainer {
    private _armature: dragonBones.Armature;
    private _armatureDisplay: dragonBones.EgretArmatureDisplay;
    private _curClock: dragonBones.WorldClock;
    private _displayEvents = [];
    private _currAction: string;

    constructor(armature: dragonBones.Armature) {
        super();
        this._armature = armature;
        this._armatureDisplay = armature.display;

        this.dealClock(this);
        // this.dealClock(this._armatureDisplay);

        this.addChild(this._armatureDisplay);
    }

    private dealClock(target: egret.DisplayObject): void {
        var addFunc: Function = target.$onAddToStage.bind(target);
        target.$onAddToStage = (stage: egret.Stage, nestLevel: number) => {
            addFunc(stage, nestLevel);
            this.$addToClock();
        }

        var removeFunc: Function = target.$onRemoveFromStage.bind(target);
        target.$onRemoveFromStage = () => {
            removeFunc();
            this.$removeFromClock();
        }
    }

    private addToClock(clock: dragonBones.WorldClock): void {
        if (this._curClock) {
            return;
        }
        this._curClock = clock;
        this._curClock.add(this._armature);

        if (DEBUG) {
            console.log("当前运行着的DB数量", this.getRunDbNum());
        }
    }

    /**
     * 慎用
     */
    public $addToClock(): void {
        this.addToClock(dragonBones.EgretFactory.factory.clock);
    }

    /**
     * 慎用
     */
    public $removeFromClock(): void {
        if (!this._curClock) {
            return;
        }
        this._curClock.remove(this._armature);
        this._curClock = null;

        if (DEBUG) {
            console.log("当前运行着的DB数量", this.getRunDbNum());
        }
    }

    private getRunDbNum(): string {
        var arr = dragonBones.EgretFactory.factory.clock["_animatebles"];
        var dic = {};
        arr.forEach(t => {
            if (t) {
                var name = t.armatureData.name;
                if (!dic[name]) {
                    dic[name] = 0;
                }
                dic[name]++;
            }
        })
        return JSON.stringify(dic);
    }

    public gotoAndStop(animationName: string): void {
        this._currAction = animationName;
        this._armature.animation.gotoAndStopByFrame(animationName)
    }

    public gotoAndStopByTime(animationName: string, time?: number): void {
        this._currAction = animationName;
        this._armature.animation.gotoAndStopByTime(animationName, time)
    }

    public gotoAndStopByProgress(animationName: string, progress?: number): void {
        this._currAction = animationName;
        this._armature.animation.gotoAndStopByProgress(animationName, progress)
    }

    public play(animationName: string, playTimes: number = 0): dragonBones.AnimationState {
        this._currAction = animationName;
        return this._armature.animation.play(animationName, playTimes);
    }

    public get currAction(): string {
        return this._currAction;
    }

    public stop(): void {
        this._armature.animation.stop();
    }

    public replaceSlot(slotName: string, display: egret.DisplayObject): void {
        let slot: dragonBones.Slot = this._armature.getSlot(slotName);
        if (slot) {
            slot.display = display;
        }
    }

    public replaceTexture(texture: any): void {
        this._armature.replaceTexture(texture);
    }

    public replaceSkin(skinData: dragonBones.SkinData): void {
        AssetManager.dbFactory.replaceSkin(this._armature, skinData);
    }

    public get armatureName(): string {
        return this._armature.name;
    }

    public get timeScale(): number {
        return this._armature.animation.timeScale;
    }

    public set timeScale(value: number) {
        if (!this._armature) {
            return;
        }
        this._armature.animation.timeScale = value;
    }

    public getSlot(slotName: string): dragonBones.Slot {
        return this._armature.getSlot(slotName);
    }

    public getBone(boneName: string): dragonBones.Bone {
        return this._armature.getBone(boneName);
    }

    public once(type: dragonBones.EventStringType, listener: (event: dragonBones.EgretEvent) => void, target: any): void {
        this._armatureDisplay.once(type, listener, target);
    }

    public addDisplayEvent(type: dragonBones.EventStringType, listener: (event: dragonBones.EgretEvent) => void, target: any): void {
        this._armatureDisplay.addEvent(type, listener, target);
        this._displayEvents.push([type, listener, target]);
    }

    public removeDisplayEvent(type: dragonBones.EventStringType, listener: (event: dragonBones.EgretEvent) => void, target: any): void {
        this._armatureDisplay.removeEvent(type, listener, target);
    }

    public removeAllDisplayEvent(): void {
        while (this._displayEvents.length) {
            var arr = this._displayEvents.pop();
            this.removeDisplayEvent(arr[0], arr[1], arr[2]);
        }
    }

    public dispose(): void {
        if (!this._armature) {
            return;
        }

        AssetManager.removeCacheArmature(this);

        this.$removeFromClock();
        this.removeAllDisplayEvent();
        egret.Tween.removeTweens(this);
        App.DisplayUtils.removeFromParent(this);
        App.DisplayUtils.removeFromParent(this._armatureDisplay);

        this._armature.dispose();
        this._armature = null;
        this._armatureDisplay = null;
    }
}