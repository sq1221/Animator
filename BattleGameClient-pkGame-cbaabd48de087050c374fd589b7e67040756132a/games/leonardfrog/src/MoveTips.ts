// TypeScript file
class MoveTips extends egret.DisplayObjectContainer {
    private num: number;
    private rects: Array<MoveRect>;
    private rectsLen: number;
    private tmpPoint: egret.Point;
    private tickNum: number;

    public constructor(num: number) {
        super();

        this.num = num;
        this.tickNum = 0;

        this.width = GameLeonardFroG.GAME_WIDTH;
        this.height = 200;

        this.rects = [];
        this.tmpPoint = new egret.Point();
    }

    public create(): Array<any> {
        var datas: Array<any> = [];
        var gameWidth: number = this.width;
        var useWidth: number = 0
        var currX: number = gameWidth;
        while (useWidth < gameWidth * 1.5) {
            var resId: number = App.RandomUtils.limitInteger(1, 3);
            var space: number = App.RandomUtils.limitInteger(30, 100);

            //创建方块
            GameLeonardFroG.Rect_ID++;
            var rect: MoveRect = new MoveRect(resId, space);
            rect.id = DataCenter.instance.user.id + "_" + GameLeonardFroG.Rect_ID;
            currX -= rect.width;
            useWidth += rect.width;
            rect.x = currX;
            rect.y = (this.height - rect.height) * 0.5;
            this.rects.push(rect);

            GameLeonardFroG.Rects[rect.id] = rect;

            //计算间隔
            currX -= space;
            useWidth += space;

            //方块基本数据
            datas.push({
                id: rect.id,
                resId: resId,
                space: space
            });
        }
        this.rects = this.rects.reverse();
        this.rectsLen = this.rects.length;
        return datas;
    }

    public full(datas: Array<any>): void {
        var gameWidth: number = this.width;
        var currX: number = gameWidth;
        datas.forEach(data => {
            var resId = data.resId;
            var space = data.space;
            var rectId = data.id;

            //创建方块
            var rect: MoveRect = new MoveRect(resId, space);
            rect.id = rectId;
            currX -= rect.width;
            rect.x = currX;
            rect.y = (this.height - rect.height) * 0.5;
            this.rects.push(rect);

            GameLeonardFroG.Rects[rect.id] = rect;

            //计算间隔
            currX -= space;
        })
        this.rects = this.rects.reverse();
        this.rectsLen = this.rects.length;
    }

    public tick(time: number): void {
        var speed: number = GameLeonardFroG.MOVE_SPEED;
        var moveDis: number = speed * time;
        var gameWidth: number = this.width;
        var checkAddRemove: boolean = false;
        if (this.tickNum == 0) {
            checkAddRemove = true;
        }
        this.tickNum++;
        if (this.tickNum > 5) {
            this.tickNum = 0;
        }

        //处理所有方块的移动，是够添加到舞台
        for (var i = 0, len = this.rectsLen; i < len; i++) {
            var rect = this.rects[i];
            rect.x += moveDis;
            if (checkAddRemove) {
                if (rect.x + rect.width >= 0 && rect.x <= gameWidth) {
                    App.DisplayUtils.quickAddChild(this, rect);
                } else {
                    App.DisplayUtils.quickRemoveChild(rect);
                }
            }
        }

        //检测最后一个方块是否出屏幕
        var lastRect: MoveRect = this.rects[this.rectsLen - 1];
        if (lastRect.x > gameWidth) {
            var firstRect: MoveRect = this.rects[0];
            lastRect.x = firstRect.x - firstRect.space - lastRect.width;
            this.rects.pop();
            this.rects.splice(0, 0, lastRect);
        }
    }

    public hitTest(px: number): MoveRect {
        for (var i = 0, len = this.rectsLen; i < len; i++) {
            var rect = this.rects[i];
            if (rect.hitTest(px)) {
                return rect;
            }
        }
        return null;
    }
}