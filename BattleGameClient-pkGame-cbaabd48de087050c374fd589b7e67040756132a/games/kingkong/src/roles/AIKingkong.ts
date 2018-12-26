class AIKingkong extends egret.EventDispatcher
{
    public static AI_LEVEL_0:number = 0;
    public static AI_LEVEL_1:number = 1;
    public static AI_LEVEL_2:number = 2;
    public static AI_LEVEL_3:number = 3;

    public static MAX_JUMP_DIS:number = 340;
    public static MIN_JUMP_DIS:number = 100;
    public static RANDOM_JUMP_TIME:number = 3;
    private _kingkong:Kingkong;
    private _curItems:KingkongItem[];

    public level:number = 0;

    private _running:Boolean;
    private _nextRandomJumpTime:number = 3;
    private _nextJumpTime:number = 0;
    private _nextShootTime:number = 0;

    private _preItem:KingkongItem;

    constructor()
    {
        super();
    }

    public set kingkong(v:Kingkong)
    {
        this._kingkong = v;  
    }
    public set curItems(v:KingkongItem[])
    {
        this._curItems = v;
    }

    public start():void
    {
        if(this._kingkong && this._curItems)
        {
            this._running = true;
        }
    }
    public over():void
    {
        this._running = false;
    }
    public advanceTime(advancedTime:number):void
    {
        if(this._running)
        {
            if(this._kingkong.hasBoom)
            {
                this._nextShootTime -= advancedTime;
                if(this._nextShootTime < 0)
                {
                    if(this.kingkongCanShoot())
                    {
                        this.dispatchEvent(new egret.Event(Kingkong.EVENT_SHOOT));
                    }
                    this.resetNextShootTime();
                }
                
            }
            if(this._kingkong.jumpEnable())
            {
                if(this.kingkongCanJump(advancedTime))
                {
                    this.dispatchEvent(new egret.Event(Kingkong.EVENT_JUMP));
                }
                else
                {
                    this._nextRandomJumpTime -= advancedTime;
                    if(this._nextRandomJumpTime < 0)
                    {
                        this._nextRandomJumpTime = Math.random() * AIKingkong.RANDOM_JUMP_TIME;
                        if(this.randomJump())
                        {
                            this.dispatchEvent(new egret.Event(Kingkong.EVENT_JUMP));
                        }
                    }
                }
            }
        }
    }
    public resetNextShootTime():void
    {
        switch(this.level)
        {
            case AIKingkong.AI_LEVEL_0:
                this._nextShootTime = Math.random() * 1 + 1;
                break;
            case AIKingkong.AI_LEVEL_1:
                this._nextShootTime = Math.random() * 0.5 + 0.5;
                break;
            case AIKingkong.AI_LEVEL_2:
                this._nextShootTime = Math.random() * 0.5 + 0.2;
                break;
            case AIKingkong.AI_LEVEL_3: 
                this._nextShootTime = Math.random() * 0.2;
                break;
            default:
                this._nextShootTime = 1;
        }
    }
    public kingkongCanShoot():boolean
    {
        var random:number = Math.random();
        switch(this.level)
        {
            case AIKingkong.AI_LEVEL_0:
                if(random < 0.2)
                {
                    return true;
                }
                break;
            case AIKingkong.AI_LEVEL_1:
                if(random < 0.4)
                {
                    return true;
                }
                break;
            case AIKingkong.AI_LEVEL_2:
                if(random < 0.8)
                {
                    return true;
                }
                break;
            case AIKingkong.AI_LEVEL_3:
                if(random < 1.2)
                {
                    return true;
                }
                break;
            default:
                return true;
        }

        return false;
    }

    public kingkongCanJump(advancedTime:number):boolean
    {
        if(this._curItems && this._curItems.length > 0)
        {
            
            var offY:number =  this._kingkong.y - this._curItems[0].y;

            if(offY > AIKingkong.MIN_JUMP_DIS && offY < AIKingkong.MAX_JUMP_DIS)
            {
                this._nextJumpTime -= advancedTime;
                if(this._nextJumpTime < 0)
                {
                    var random:number = Math.random();
                    switch(this.level)
                    {
                        case AIKingkong.AI_LEVEL_0:
                            this._nextJumpTime = Math.random()*0.1 + 0.3
                            if(random < 0.2)
                            {
                                return true;
                            }
                            break;
                        case AIKingkong.AI_LEVEL_1:
                            this._nextJumpTime = Math.random()*0.1 + 0.2
                            if(random < 0.5)
                            {
                                return true;
                            }
                            break;
                        case AIKingkong.AI_LEVEL_2:
                            this._nextJumpTime = Math.random()*0.1 + 0.1;
                            if(random < 0.8)
                            {
                                if(this._curItems[0].type == KingkongItem.TYPE_FIRE_BOOM)
                                {
                                    return true;
                                }
                            }
                            break;
                        case AIKingkong.AI_LEVEL_3:
                            if(random < 1.2)
                            {   
                                if(this._curItems[0].type == KingkongItem.TYPE_FIRE_BOOM)
                                {
                                    return true;
                                }
                            }
                            break;
                        default:
                            return true;
                    }
                }
                
            }
            
        }
        
        return false;
    }

    public randomJump():boolean
    {
           var random:number = Math.random();
            switch(this.level)
            {
                case AIKingkong.AI_LEVEL_0:
                    if(random > 0.2)
                    {
                        return false;
                    }
                    break;
                case AIKingkong.AI_LEVEL_1:
                    if(random < 0.4)
                    {
                        return false;
                    }
                    break;
                case AIKingkong.AI_LEVEL_2:
                    if(random < 0.8)
                    {
                        return false;
                    }
                    break;
                case AIKingkong.AI_LEVEL_3:
                    if(random < 1.2)
                    {
                        return false;
                    }
                    break;
                default:
                    return false;
            }
        return true;
    }
}

