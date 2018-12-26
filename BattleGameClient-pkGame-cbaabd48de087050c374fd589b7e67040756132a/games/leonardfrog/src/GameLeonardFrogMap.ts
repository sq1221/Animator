//青蛙过河移动地图类
class GameLeonardFrogMap extends egret.DisplayObjectContainer {
    public tip1: MoveTips;
    public tip2: MoveTips;
    public tip3: MoveTips;
    public tip4: MoveTips;
    
    public constructor() {
        super();

        this.width = 640;
        this.height = 800;
    }

    public createSelfTips():Array<any>{
        this.tip1 = new MoveTips(1);
        var tips1Datas = this.tip1.create();

        this.tip2 = new MoveTips(2);
        var tips2Datas = this.tip2.create();
        this.tip2.scaleX = -1;
        this.tip2.x = this.width;
        
        this.tip2.y = 400
        this.tip1.y = 600

        this.addChild(this.tip1);
        this.addChild(this.tip2);

        return [tips1Datas, tips2Datas]
    }

    public createEnemyTips(tips1Datas, tips2Datas):void{
        this.tip3 = new MoveTips(3);
        this.tip3.full(tips2Datas);

        this.tip4 = new MoveTips(4);
        this.tip4.full(tips1Datas);
        this.tip4.scaleX = -1;
        this.tip4.x = this.width;

        this.tip4.y = 0
        this.tip3.y = 200

        this.addChild(this.tip3);
        this.addChild(this.tip4);
    }

    public tick(time:number):void{
        this.tip1.tick(time);
        this.tip2.tick(time);
        this.tip3.tick(time);
        this.tip4.tick(time);
    }
}