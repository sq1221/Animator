// TypeScript file
//五子棋 棋子
class ChessmanFive extends egret.DisplayObjectContainer {
    private img1: egret.Bitmap;
    public constructor(resId: number) {
        super();

        this.img1 = App.DisplayUtils.createBitmap("chessman_" + resId + "_png");

        this.addChild(this.img1);
        this.anchorOffsetX = this.anchorOffsetY = 20;
    }

    public init() {

    }
}