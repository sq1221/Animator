class DBButton extends egret.DisplayObjectContainer
{
    private _armature:DBArmature;

    constructor(armature:DBArmature)
    {
        super();
        this.touchEnabled = true;
        this._armature = armature;

        this._armature.gotoAndStop("normal");
        this.addChild(this._armature);
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin,this);
        
    }

    private onTouchBegin(e):void
    {
        this._armature.gotoAndStop("touch");
        if(this.stage)
        {
            this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd,this);
        }
    }
    private onTouchEnd(e):void
    {
        if(this.stage)
        {
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd,this);
        }
        this._armature.gotoAndStop("normal");
    }
}