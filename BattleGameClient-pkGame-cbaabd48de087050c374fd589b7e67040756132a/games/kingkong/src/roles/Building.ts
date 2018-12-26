class Building extends egret.Sprite
{
    public static NORMAL_SPEED:number = 2;
    public static FAST_SPEED:number =3;

    private dbBuilding:DBArmature;

    public curDistance:number;
    public tickDistance:number;
    private _lastD:number;
    private _curD:number;
    private _offset:number = 1195;

    private _bone:dragonBones.Bone;

    public constructor()
    {
        super();
        var name:string = "ground";

        this.dbBuilding = AssetManager.getDBArmature(name);
        this._bone = this.dbBuilding.getBone("bone");
        this.addChild(this.dbBuilding);
        this.stop();
        this.reset();
    }

    public reset():void
    {
        this._curD = this._bone.globalTransformMatrix.ty;
        this._lastD = this._curD;
        this.tickDistance = 0;
        this.curDistance = 0;
    }

    public advanceTime(advancedTime:number):void
    {
        this._curD = this._bone.globalTransformMatrix.ty;
        this.tickDistance = this._curD - this._lastD;
        while(this.tickDistance < 0)
        {
            this.tickDistance += this._offset;
        }
        this._lastD = this._curD;
        this.curDistance += this.tickDistance;
        //console.log(this.tickDistance, this.curDistance);
    }

    public runNormal():void
    {
        let tw = egret.Tween.get(this.dbBuilding);
        tw.to({"timeScale":Building.NORMAL_SPEED},500);
        // this.armature.animation.timeScale = Building.NORMAL_SPEED;
    }

    public runFast():void
    {
        let tw = egret.Tween.get(this.dbBuilding);
        tw.to({"timeScale":Building.FAST_SPEED},500);
        //this.armature.animation.timeScale = Building.FAST_SPEED;
    }

    public runSlow():void
    {
        this.dbBuilding.timeScale = 0;
    }
    public run():void
    {
        this.dbBuilding.play("run");
        this.runSlow();
        this.runNormal();
        this.reset();
    }
    public stop():void
    {
        this.dbBuilding.stop();
    }
}