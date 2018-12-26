
class MoveRect extends egret.DisplayObjectContainer {
    private img1: egret.Bitmap;
    private tmpPoint: egret.Point;
    private tmpX: number;
    public space: number;
    public id: string;
    public flower1: DBArmature;//

    public constructor(resId: number, space: number) {
        super();

        this.space = space;

        this.flower1 = AssetManager.getQuickDBArmature("lotus");

        this.addChild(this.flower1);
        this.flower1.play("wood", 0);

        this.img1 = App.DisplayUtils.createBitmap("kuai" + resId + "_png");
        this.addChild(this.img1);

        this.flower1.x = 0;
        this.flower1.y = this.img1.height / 2;
    }

    public hitTest(px: number): boolean {
        if (!this.parent) {
            return false;
        }

        if (!this.tmpPoint) {
            this.tmpPoint = new egret.Point();
            this.tmpX = this.x;
            if (this.parent.scaleX == -1) {
                this.localToGlobal(this.img1.width, 0, this.tmpPoint);
            } else {
                this.localToGlobal(0, 0, this.tmpPoint);
            }
        } else {
            this.tmpPoint.x += (this.x - this.tmpX) * this.parent.scaleX;
            this.tmpX = this.x;
        }

        if (px > this.tmpPoint.x && px < this.tmpPoint.x + this.img1.width) {
            return true;
        }
        return false;
    }
}