class DBAnimButton extends egret.DisplayObjectContainer
{
    private _armature:DBArmature;

    constructor(armature:DBArmature)
    {
        super();
        this._armature = armature;

        this._armature.gotoAndStop("normal");
        
        this._armature.addDisplayEvent(dragonBones.AnimationEvent.LOOP_COMPLETE,this.onAnimComplete, this);
        this.addChild(this._armature);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch,this);
    }

    private onTouch(e):void
    {
        this.touch();
    }
    private onAnimComplete(e):void
    {
        this._armature.gotoAndStop("normal");
    }
    public touch():void
    {
        this._armature.play("touch");
    }
}