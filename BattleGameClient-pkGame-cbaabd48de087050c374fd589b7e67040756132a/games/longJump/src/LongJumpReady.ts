namespace GameLongJump {
    export class LongJumpReady extends GameReady {
        bgmask: egret.Bitmap;
        title: egret.Bitmap;
        public constructor(callback: () => any) {
            super(callback, "longJump_ready_png", "longJump_go_png");
            this.bgmask = AssetManager.getBitmap("longJump_blackMask_png", false, false);
            this.title = AssetManager.getBitmap("readyGoTitle_png");

            this.bgmask.width = App.GameWidth;
            this.bgmask.height = App.GameHeight;
            this.bgmask.alpha = 0.5;


            this.addChildAt(this.bgmask, 0);

            this.imgReady.x = this.imgGo.x = this.title.x = App.GameWidth / 2;
            this.imgReady.y = this.imgGo.y = App.GameHeight / 2 - 50;

            this.title.y = App.GameHeight / 2 + 50;
            this.addChild(this.title);
        }

        hide(): void {
            this.imgReady.alpha = 0;
            this.imgGo.alpha = 0;
            this.title.alpha = 0;
            this.bgmask.alpha = 0;
        }

        public play(): void {
            this.hide();
            App.SoundManager.playEffect("readyGo_mp3");
            this.imgReady.alpha = 1;
            this.bgmask.alpha = 0.5;
            this.title.alpha = 1;
            this.stepReady = setTimeout(() => {
                this.hide();
                this.imgGo.alpha = 1;
                this.bgmask.alpha = 0.5;
                this.title.alpha = 1;
                this.stepGo = setTimeout(() => {
                    this.hide();
                    this._callback();
                    clearTimeout(this.stepGo);
                    this.stepGo = undefined;
                }, 500);
                clearTimeout(this.stepReady);
                this.stepReady = undefined;
            }, 1000);
        }

        dispose() {
            super.dispose();
            this.bgmask = undefined;
            this.title = undefined;
        }
    }
}