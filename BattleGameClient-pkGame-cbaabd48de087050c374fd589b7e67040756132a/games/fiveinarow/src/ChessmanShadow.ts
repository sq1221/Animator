//五子棋 棋子
class ChessmanShadow extends egret.DisplayObjectContainer {
    private img1: egret.Bitmap;
    private img2: egret.Bitmap;
    public INIT_X: number = 0;
    public INIT_Y: number = 0;

    public constructor(resId: number) {
        super();

        this.img1 = App.DisplayUtils.createBitmap("chessman_" + resId + "_png");
        this.img2 = App.DisplayUtils.createBitmap("img_redying_png");

        this.addChild(this.img1);
        this.addChild(this.img2);
        this.touchEnabled = false;
        this.touchChildren = false;
        this.img1.anchorOffsetX = this.img1.anchorOffsetY = 20;
        this.img2.anchorOffsetX = this.img2.anchorOffsetY = 100;
    }

    public init() {

    }
}