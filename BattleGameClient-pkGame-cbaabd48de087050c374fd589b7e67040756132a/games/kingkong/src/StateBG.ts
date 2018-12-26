class StateBG extends State {
    public background: egret.Bitmap;
    public stageWidth: number;
    public stageHeight: number;
    public halfStageWidth: number;
    public halfStageHeight: number;
    public constructor() {
        super();
    }

    public init(): void {
        this.stageWidth = App.GameWidth;
        this.stageHeight = App.GameHeight;
        this.halfStageWidth = this.stageWidth / 2;
        this.halfStageHeight = this.stageHeight / 2;

        //console.log("stage:", this.stageWidth, this.stageHeight);
    }

    public set bg(v: string) {
        this.background = AssetManager.getBitmap(v);
        if (this.background) {
            this.background.x = this.stageWidth / 2;
            this.background.y = this.stageHeight / 2;
            //this.background.y =  this.background.height / 2;
            this.addChild(this.background);
        }
    }
}