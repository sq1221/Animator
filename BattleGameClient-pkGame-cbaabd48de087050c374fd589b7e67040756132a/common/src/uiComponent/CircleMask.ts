// TypeScript file
class CircleMask {

    private static circleMask: egret.Bitmap;
    private static rect1: eui.Rect;
    private static rect2: eui.Rect;
    private static rect3: eui.Rect;
    private static rect4: eui.Rect;

    private static time = 550;
    private static multiple = 3
    private static Arr = [];
    private static isHadShow: boolean = false;

    public static hide(callback: Function): void {
        if (!this.circleMask) {
            this.init();
        }

        if (!this.isHadShow) {
            //左 右
            this.rect1.width = this.rect2.width = App.GameWidth / 2;
            this.rect1.height = this.rect2.height = App.GameHeight;
            //上 下
            this.rect3.height = this.rect4.height = App.GameHeight / 2;
            this.rect3.width = this.rect4.width = App.GameWidth;
            this.circleMask.anchorOffsetX = this.circleMask.width / 2;
            this.circleMask.anchorOffsetY = this.circleMask.height / 2;
            this.circleMask.x = App.GameWidth / 2;
            this.circleMask.y = App.GameHeight / 2;
        }

        App.StageUtils.getStage().addChild(this.circleMask);
        App.StageUtils.getStage().addChild(this.rect1);
        App.StageUtils.getStage().addChild(this.rect2);
        App.StageUtils.getStage().addChild(this.rect3);
        App.StageUtils.getStage().addChild(this.rect4);

        this.circleMask.scaleX = this.circleMask.scaleY = this.multiple;

        this.rect1.x = this.circleMask.x - this.circleMask.width * this.multiple / 2 - this.rect1.width;
        this.rect2.x = this.circleMask.x + this.circleMask.width * this.multiple / 2;

        this.rect3.y = this.circleMask.y - this.circleMask.height * this.multiple / 2 - this.rect3.height;
        this.rect4.y = this.circleMask.y + this.circleMask.height * this.multiple / 2;

        this.Arr[0] = this.rect1.x;
        this.Arr[1] = this.rect2.x;
        this.Arr[2] = this.rect3.y;
        this.Arr[3] = this.rect4.y;



        let tw = egret.Tween.get(this.circleMask);
        tw.to({ scaleX: 0, scaleY: 0 }, this.time, egret.Ease.quadInOut);
        tw.call(() => {
            callback();
        });

        let tw1 = egret.Tween.get(this.rect1);
        tw1.to({ x: App.GameWidth / 2 - this.rect1.width }, this.time, egret.Ease.quadInOut);

        let tw2 = egret.Tween.get(this.rect2);
        tw2.to({ x: App.GameWidth / 2 }, this.time, egret.Ease.quadInOut);

        let tw3 = egret.Tween.get(this.rect3);
        tw3.to({ y: App.GameHeight / 2 - this.rect3.height }, this.time, egret.Ease.quadInOut);

        let tw4 = egret.Tween.get(this.rect4);
        tw4.to({ y: App.GameHeight / 2 }, this.time, egret.Ease.quadInOut);
    }

    public static show(callback: Function): void {
        if (!this.circleMask) {
            this.init();
        }
        this.isHadShow = true;

        //左 右
        this.rect1.width = this.rect2.width = App.GameWidth / 2;
        this.rect1.height = this.rect2.height = App.GameHeight;
        this.rect1.y = this.rect2.y = 0;
        this.rect1.x = App.GameWidth / 2 - this.rect1.width;
        this.rect2.x = App.GameWidth / 2;

        //上 下
        this.rect3.height = this.rect4.height = App.GameHeight / 2;
        this.rect3.width = this.rect4.width = App.GameWidth;
        this.rect3.x = this.rect4.x = 0;
        this.rect3.y = App.GameHeight / 2 - this.rect3.height;
        this.rect4.y = App.GameHeight / 2;

        this.circleMask.anchorOffsetX = this.circleMask.width / 2;
        this.circleMask.anchorOffsetY = this.circleMask.height / 2;
        this.circleMask.x = App.GameWidth / 2;
        this.circleMask.y = App.GameHeight / 2;
        this.circleMask.scaleX = this.circleMask.scaleY = 0;

        let tw = egret.Tween.get(this.circleMask);
        tw.to({ scaleX: this.multiple, scaleY: this.multiple }, this.time, egret.Ease.quadInOut);
        tw.call(() => {
            callback();
        });

        let tw1 = egret.Tween.get(this.rect1);
        tw1.to({ x: this.Arr[0] }, this.time, egret.Ease.quadInOut);

        let tw2 = egret.Tween.get(this.rect2);
        tw2.to({ x: this.Arr[1] }, this.time, egret.Ease.quadInOut);

        let tw3 = egret.Tween.get(this.rect3);
        tw3.to({ y: this.Arr[2] }, this.time, egret.Ease.quadInOut);

        let tw4 = egret.Tween.get(this.rect4);
        tw4.to({ y: this.Arr[3] }, this.time, egret.Ease.quadInOut);
    }

    private static init(): void {
        this.circleMask = App.DisplayUtils.createBitmap("circlePlot_png");

        //上 下 左 右
        this.rect1 = new eui.Rect();
        this.rect2 = new eui.Rect();
        this.rect3 = new eui.Rect();
        this.rect4 = new eui.Rect();
        this.rect1.fillColor = 0x000000;
        this.rect2.fillColor = 0x000000;
        this.rect3.fillColor = 0x000000;
        this.rect4.fillColor = 0x000000;
    }
}