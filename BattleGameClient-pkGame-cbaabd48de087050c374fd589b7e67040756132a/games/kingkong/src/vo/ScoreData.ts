class ScoreData
{
    private _curBestHit:number = 0;
    private _curGoodHit:number = 0;
    private _curMissHit:number = 0;
    private _curComboo:number = 0;

    public maxBestHit:number = 0;
    public maxGoodHit:number = 0;
    public maxMissHit:number = 0;
    public maxComboo:number = 0;

    public set curBestHit(v:number)
    {
        this._curBestHit = v;
        if(this.maxBestHit < this._curBestHit)
        {
            this.maxBestHit = this._curBestHit;
        }
        this.curComboo++;
        console.log("cur best:", this._curBestHit)
    }
    public get curBestHit():number
    {
        return this._curBestHit;
    }

    public set curGoodHit(v:number)
    {
        this._curGoodHit = v;
        if(this.maxGoodHit < this._curGoodHit)
        {
            this.maxGoodHit = this._curGoodHit;
        }
        this.curComboo++;
        console.log("cur good:", this._curGoodHit)
    }
    public get curGoodHit():number
    {
        return this._curGoodHit;
    }

    public set curMissHit(v:number)
    {
        this._curMissHit = v;
        if(this.maxMissHit < this._curMissHit)
        {
            this.maxMissHit = this._curMissHit;
        }
        this._curComboo = 0;
    }
    public get curMissHit():number
    {
        return this._curMissHit;
    }

    public set curComboo(v:number)
    {
        this._curComboo = v;
        if(this.maxComboo < this._curComboo)
        {
            this.maxComboo = this._curComboo;
        }
        console.log("cur comboo:", this._curComboo)
    }
    public get curComboo():number
    {
        return this._curComboo;
    }
}