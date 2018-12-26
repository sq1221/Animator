class DBProgress extends egret.DisplayObjectContainer
{
    private _armature:DBArmature;

    private _progress:number;

    constructor(armature:DBArmature)
    {
        super();
        this._armature = armature

        this._armature.gotoAndStop("progress");
        
        this.addChild(this._armature);
    }

    public set progress(v:number)
    {
        this._progress = v;
        if(this._progress > 1)
        {
            this._progress = 1;
        }
        if(this._progress < 0)
        {
            this._progress = 0;
        }
        this._armature.gotoAndStopByProgress("progress", this._progress);
    }

    public get progress():number
    {
        return this._progress;
    }
}