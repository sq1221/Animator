namespace GameLongJump {
    export class GameLongJumpResult {
        private winImage: egret.Bitmap;
        private loseImage: egret.Bitmap;
        private mask: egret.Bitmap;
        winContainner: egret.DisplayObjectContainer;
        loseContainner: egret.DisplayObjectContainer;

        private selfScoreBG: egret.Bitmap;
        private comScoreBg: egret.Bitmap;
        private selfHeadBg: egret.Bitmap;
        private selfHead: RoleHeadImage;
        private comHeadBg: egret.Bitmap;
        private comHead: RoleHeadImage;
        private comScoreView: egret.TextField;
        private selfScoreView: egret.TextField;

        private selfContainner: egret.DisplayObjectContainer;
        private comContainner: egret.DisplayObjectContainer;

        private winTag: egret.Bitmap;
        init() {
            this.selfContainner = new egret.DisplayObjectContainer();
            this.comContainner = new egret.DisplayObjectContainer();
            this.winContainner = new egret.DisplayObjectContainer();
            this.loseContainner = new egret.DisplayObjectContainer();

            this.mask = AssetManager.getBitmap("longJump_blackMask_png", false, false);
            this.mask.width = App.GameWidth;
            this.mask.height = App.GameHeight;
            this.mask.anchorOffsetX = this.mask.width / 2;
            this.mask.anchorOffsetY = this.mask.height / 2;
            this.mask.alpha = 0.5;

            if (DataCenter.instance.room.selfIsMaster) {
                this.winImage = AssetManager.getBitmap("winGreen_png");
                this.loseImage = AssetManager.getBitmap("loseRed_png");

                this.selfScoreBG = AssetManager.getBitmap("green_png");
                this.comScoreBg = AssetManager.getBitmap("red_png");
                this.selfHeadBg = AssetManager.getBitmap("headBg_green_png");
                this.comHeadBg = AssetManager.getBitmap("headBg_red_png");
            }
            else {
                this.winImage = AssetManager.getBitmap("winRed_png");
                this.loseImage = AssetManager.getBitmap("loseGreen_png");

                this.selfScoreBG = AssetManager.getBitmap("red_png");
                this.comScoreBg = AssetManager.getBitmap("green_png");
                this.comHeadBg = AssetManager.getBitmap("headBg_green_png");
                this.selfHeadBg = AssetManager.getBitmap("headBg_red_png");
            }

            this.winImage.y = this.loseImage.y = -100;

            this.selfScoreBG.anchorOffsetX = this.selfScoreBG.width;
            this.comScoreBg.anchorOffsetX = 0;

            this.selfHeadBg.x = this.selfScoreBG.x - this.selfScoreBG.width;
            this.selfHead = new RoleHeadImage(DataCenter.instance.user.imgUrl);
            this.selfHead.anchorOffsetX = this.selfHead.width / 2;
            this.selfHead.anchorOffsetY = this.selfHead.height / 2;
            this.selfHead.x = this.selfHeadBg.x;

            this.comHeadBg.x = this.comScoreBg.x + this.comScoreBg.width;
            this.comHead = new RoleHeadImage(DataCenter.instance.room.player.imgUrl);
            this.comHead.anchorOffsetX = this.comHead.width / 2;
            this.comHead.anchorOffsetY = this.comHead.height / 2;
            this.comHead.x = this.comHeadBg.x;

            this.selfScoreBG.y = this.comScoreBg.y = this.selfHeadBg.y = this.comHeadBg.y = this.selfHead.y = this.comHead.y = this.winImage.height / 2 + 30;

            this.winTag = AssetManager.getBitmap("winTag_png");
        }

        initData() {
            this.selfScoreView = new egret.TextField();
            let selfScore = GameLongJumpView.instance.stateController.selfScore;
            if (selfScore < 10)
                this.selfScoreView.text = "0" + selfScore;
            else
                this.selfScoreView.text = selfScore.toString();
            this.selfScoreView.size = 40;
            this.selfScoreView.anchorOffsetX = this.selfScoreView.measuredWidth;
            this.selfScoreView.anchorOffsetY = this.selfScoreView.measuredHeight / 2;
            this.selfScoreView.x = -this.selfScoreBG.width / 3;
            this.selfScoreView.y = this.winImage.height / 2 + 30;

            this.comScoreView = new egret.TextField();
            let comScore = GameLongJumpView.instance.stateController.comScore;
            if (comScore < 10)
                this.comScoreView.text = "0" + comScore;
            else
                this.comScoreView.text = comScore.toString();
            this.comScoreView.size = 40;
            this.comScoreView.anchorOffsetX = 0;
            this.comScoreView.anchorOffsetY = this.comScoreView.measuredHeight / 2;
            this.comScoreView.x = this.comScoreBg.width / 3;
            this.comScoreView.y = this.winImage.height / 2 + 30;;

            this.selfContainner.addChild(this.selfScoreBG);
            this.comContainner.addChild(this.comScoreBg);
            this.selfContainner.addChild(this.selfHeadBg);
            this.comContainner.addChild(this.comHeadBg);
            this.selfContainner.addChild(this.selfHead);
            this.comContainner.addChild(this.comHead);
            this.selfContainner.addChild(this.selfScoreView);
            this.comContainner.addChild(this.comScoreView);
        }

        win() {
            this.initData();
            this.winContainner.addChild(this.winImage);
            this.winContainner.addChild(this.selfContainner);
            this.winContainner.addChild(this.comContainner);

            this.winTag.anchorOffsetX = this.winTag.width;
            this.winTag.y = this.selfScoreBG.y - 30;
            this.winTag.x = this.selfScoreBG.x;
            this.selfContainner.addChild(this.winTag);

            this.selfContainner.x = -350;
            egret.Tween.get(this.selfContainner).to({ x: -20 }, 300);
            this.comContainner.x = 350;
            egret.Tween.get(this.comContainner).to({ x: 20 }, 350);
            this.winContainner.addChildAt(this.mask, 0);

            this.selfContainner.y = this.comContainner.y = -50;
            this.winContainner.x = App.GameWidth / 2;
            this.winContainner.y = App.GameHeight / 2;
            GameLongJumpView.instance.addChild(this.winContainner);
        }
        lose(istime = false) {
            this.initData();
            this.loseContainner.addChildAt(this.mask, 0);
            this.loseContainner.addChild(this.loseImage);
            this.loseContainner.addChild(this.selfContainner);;
            this.loseContainner.addChild(this.comContainner);
            this.winTag.anchorOffsetX = 0;
            this.winTag.y = this.comScoreBg.y - 30;
            this.winTag.x = this.comScoreBg.x;
            this.comContainner.addChild(this.winTag);

            this.selfContainner.x = -350;
            egret.Tween.get(this.selfContainner).to({ x: -20 }, 300);
            this.comContainner.x = 350;
            egret.Tween.get(this.comContainner).to({ x: 20 }, 300);

            this.selfContainner.y = this.comContainner.y = -50;
            this.loseContainner.x = App.GameWidth / 2;
            this.loseContainner.y = App.GameHeight / 2;
            GameLongJumpView.instance.addChild(this.loseContainner);
        }
        dispose() {
        }
    }
}
