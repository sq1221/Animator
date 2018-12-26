class GameReady extends egret.DisplayObjectContainer {

    /**
     * 回调函数，动画播放完毕后触发
     */
    protected _callback: () => any;

    protected imgReady: egret.Bitmap;
    protected imgGo: egret.Bitmap;

    protected stepReady: number;
    protected stepGo: number;

    /**
     * 提供一个准备动画，在播放完毕后可以触发回调函数，callback：回调函数
     */
    public constructor(callback: () => any, raeadyURL = "ready_png", goURL = "go_png") {
        super();
        this._callback = callback;
        this.imgReady = AssetManager.getBitmap(raeadyURL);
        this.imgGo = AssetManager.getBitmap(goURL);
        this.addChild(this.imgReady);
        this.addChild(this.imgGo);
    }

    protected hide(): void {
        this.imgReady.alpha = 0;
        this.imgGo.alpha = 0;
    }

    public play(): void {
        this.hide();
        App.SoundManager.playEffect("readyGo_mp3");
        this.imgReady.alpha = 1;
        this.stepReady = setTimeout(() => {
            this.hide();
            this.imgGo.alpha = 1;
            this.stepGo = setTimeout(() => {
                this.hide();
                this._callback();
                clearTimeout(this.stepGo);
                this.stepGo = undefined;
            }, 1000);
            clearTimeout(this.stepReady);
            this.stepReady = undefined;
        }, 1000);
    }

    dispose() {
        if (this.stepReady) { clearTimeout(this.stepReady); this.stepReady = undefined; }
        if (this.stepGo) { clearTimeout(this.stepGo); this.stepGo = undefined; }
        this._callback = undefined;
        this.imgGo = undefined;
        this.imgReady = undefined;
    }
}